'use server';

// =============================================================================
// Furnishara – Server Actions
// Secure mutation layer using Next.js Server Actions + Supabase
// =============================================================================

import { revalidatePath } from 'next/cache';
import { createClient } from './server';
import type {
  CheckoutInput,
  CreateReviewInput,
  RegisterWarrantyInput,
  CreateB2BInquiryInput,
} from '@/types';
import { DEFAULT_TAX_RATE, DEFAULT_WARRANTY_YEARS } from '@/lib/constants';

// ─── Auth Helpers ────────────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Authentication required');
  }

  return { supabase, user };
}

// ─── Cart Actions ────────────────────────────────────────────────────────────

export async function addToCartAction(
  productId: string,
  unitPrice: number,
  materialId?: string,
  quantity = 1,
) {
  const { supabase, user } = await getAuthenticatedUser();

  // Get or create cart
  const { data: existingCart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  let cartId: string;

  if (existingCart) {
    cartId = existingCart.id;
  } else {
    const { data: newCart, error } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single();

    if (error) throw error;
    cartId = newCart.id;
  }

  // Check for existing item
  let existingItemQuery = supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cartId)
    .eq('product_id', productId);

  if (materialId) {
    existingItemQuery = existingItemQuery.eq('material_id', materialId);
  } else {
    existingItemQuery = existingItemQuery.is('material_id', null);
  }

  const { data: existingItem } = await existingItemQuery.single();

  if (existingItem) {
    await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);
  } else {
    await supabase.from('cart_items').insert({
      cart_id: cartId,
      product_id: productId,
      material_id: materialId,
      quantity,
      unit_price: unitPrice,
    });
  }

  revalidatePath('/cart');
  return { success: true };
}

export async function updateCartItemAction(itemId: string, quantity: number) {
  const { supabase } = await getAuthenticatedUser();

  if (quantity <= 0) {
    await supabase.from('cart_items').delete().eq('id', itemId);
  } else {
    await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);
  }

  revalidatePath('/cart');
  return { success: true };
}

export async function removeCartItemAction(itemId: string) {
  const { supabase } = await getAuthenticatedUser();
  await supabase.from('cart_items').delete().eq('id', itemId);

  revalidatePath('/cart');
  return { success: true };
}

// ─── Wishlist Actions ────────────────────────────────────────────────────────

export async function createWishlistAction(name: string, description?: string) {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from('wishlists')
    .insert({ user_id: user.id, name, description })
    .select('*')
    .single();

  if (error) throw error;

  revalidatePath('/account/wishlists');
  return data;
}

export async function addToWishlistAction(
  wishlistId: string,
  productId: string,
  materialId?: string,
) {
  const { supabase } = await getAuthenticatedUser();

  const { error } = await supabase.from('wishlist_items').upsert(
    {
      wishlist_id: wishlistId,
      product_id: productId,
      material_id: materialId,
    },
    { onConflict: 'wishlist_id,product_id,material_id' },
  );

  if (error) throw error;

  revalidatePath('/account/wishlists');
  return { success: true };
}

// ─── Review Actions ──────────────────────────────────────────────────────────

export async function submitReviewAction(input: CreateReviewInput) {
  const { supabase, user } = await getAuthenticatedUser();

  // Check if user already reviewed this product
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('product_id', input.product_id)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    throw new Error('You have already reviewed this product');
  }

  // Check verified purchase
  const { data: purchaseCheck } = await supabase
    .from('order_items')
    .select('id, order:orders!inner(user_id, status)')
    .eq('product_id', input.product_id)
    .eq('order.user_id', user.id)
    .eq('order.status', 'delivered')
    .limit(1);

  const isVerified = (purchaseCheck?.length ?? 0) > 0;

  const { data: review, error } = await supabase
    .from('reviews')
    .insert({
      product_id: input.product_id,
      user_id: user.id,
      rating: input.rating,
      title: input.title,
      body: input.body,
      is_verified_purchase: isVerified,
      is_approved: false, // Requires moderation
    })
    .select('id')
    .single();

  if (error) throw error;

  // Upload photos if provided
  if (input.photos && input.photos.length > 0) {
    for (let i = 0; i < input.photos.length; i++) {
      const file = input.photos[i];
      const filePath = `reviews/${review.id}/${i}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('review-photos')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('review-photos')
          .getPublicUrl(filePath);

        await supabase.from('review_photos').insert({
          review_id: review.id,
          url: publicUrl,
          sort_order: i,
        });
      }
    }
  }

  revalidatePath(`/products`);
  return { success: true, reviewId: review.id };
}

// ─── Warranty Actions ────────────────────────────────────────────────────────

export async function registerWarrantyAction(input: RegisterWarrantyInput) {
  const { supabase, user } = await getAuthenticatedUser();

  const registrationDate = new Date();
  const expiryDate = new Date(registrationDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + DEFAULT_WARRANTY_YEARS);

  const { data, error } = await supabase
    .from('warranties')
    .insert({
      user_id: user.id,
      order_id: input.order_id,
      order_item_id: input.order_item_id,
      product_id: input.product_id,
      serial_number: input.serial_number,
      registration_date: registrationDate.toISOString().slice(0, 10),
      expiry_date: expiryDate.toISOString().slice(0, 10),
      warranty_years: DEFAULT_WARRANTY_YEARS,
      status: 'active',
    })
    .select('*')
    .single();

  if (error) throw error;

  revalidatePath('/account/warranties');
  return data;
}

// ─── B2B Inquiry Actions ─────────────────────────────────────────────────────

export async function submitB2BInquiryAction(input: CreateB2BInquiryInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Upload attachments if any
  const attachments: Array<{ url: string; filename: string }> = [];
  if (input.attachments) {
    for (const file of input.attachments) {
      const filePath = `b2b-inquiries/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('b2b-attachments')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('b2b-attachments')
          .getPublicUrl(filePath);

        attachments.push({ url: publicUrl, filename: file.name });
      }
    }
  }

  const { data, error } = await supabase
    .from('b2b_inquiries')
    .insert({
      user_id: user?.id ?? null,
      contact_name: input.contact_name,
      company_name: input.company_name,
      email: input.email,
      phone: input.phone,
      inquiry_type: input.inquiry_type,
      project_name: input.project_name,
      description: input.description,
      budget_range: input.budget_range,
      quantity: input.quantity,
      preferred_materials: input.preferred_materials,
      custom_dimensions: input.custom_dimensions,
      attachments,
      reference_products: input.reference_products ?? [],
    })
    .select('id')
    .single();

  if (error) throw error;
  return { success: true, inquiryId: data.id };
}

// ─── Checkout / Order Actions ────────────────────────────────────────────────

export async function createOrderAction(input: CheckoutInput) {
  const { supabase, user } = await getAuthenticatedUser();

  // Get cart
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('*, items:cart_items(*, product:products(*))')
    .eq('user_id', user.id)
    .single();

  if (cartError || !cart?.items?.length) {
    throw new Error('Cart is empty');
  }

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum: number, item: { unit_price: number; quantity: number }) =>
      sum + item.unit_price * item.quantity,
    0,
  );

  const taxAmount = Math.round(subtotal * DEFAULT_TAX_RATE * 100) / 100;

  // TODO: Calculate shipping_cost via shipping calculator
  const shippingCost = 0;
  const assemblyCost = 0;

  const total = subtotal + shippingCost + assemblyCost + taxAmount;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      email: user.email!,
      subtotal,
      shipping_cost: shippingCost,
      assembly_cost: assemblyCost,
      tax_amount: taxAmount,
      total,
      shipping_address: input.shipping_address,
      billing_address: input.billing_address,
      delivery_type: input.delivery_type,
      preferred_delivery_date: input.preferred_delivery_date,
      preferred_time_slot: input.preferred_time_slot,
      assembly_requested: input.assembly_requested,
      delivery_obstacles: input.delivery_obstacles,
      payment_method: input.payment_method,
      bnpl_provider: input.bnpl_provider,
      notes: input.notes,
    })
    .select('id, order_number')
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = cart.items.map(
    (item: { product_id: string; material_id: string | null; quantity: number; unit_price: number; product: Record<string, unknown> }) => ({
      order_id: order.id,
      product_id: item.product_id,
      material_id: item.material_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.unit_price * item.quantity,
      product_snapshot: item.product, // Snapshot for historical record
    }),
  );

  await supabase.from('order_items').insert(orderItems);

  // Record initial status
  await supabase.from('order_status_history').insert({
    order_id: order.id,
    status: 'pending',
    changed_by: user.id,
  });

  // Clear cart
  await supabase.from('cart_items').delete().eq('cart_id', cart.id);

  revalidatePath('/cart');
  revalidatePath('/account/orders');

  return { success: true, orderId: order.id, orderNumber: order.order_number };
}
