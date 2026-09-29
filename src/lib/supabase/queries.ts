// =============================================================================
// Furnishara – Supabase Query Functions
// Reusable data-fetching layer for Server Components & Client Components
// =============================================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Product,
  ProductCard,
  Category,
  Cart,
  CartItem,
  Wishlist,
  Review,
  ReviewStats,
  CuratedRoom,
  ShippingZone,
  DeliverySlot,
  B2BInquiry,
  Warranty,
  Order,
} from '@/types';
import { PRODUCTS_PER_PAGE, REVIEWS_PER_PAGE } from '@/lib/constants';

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(
  supabase: SupabaseClient,
  options: {
    categorySlug?: string;
    search?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name';
    page?: number;
    limit?: number;
    featured?: boolean;
    newArrivals?: boolean;
  } = {},
) {
  const { page = 1, limit = PRODUCTS_PER_PAGE } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('products')
    .select(
      `
      id, slug, name, tagline, base_price, compare_at_price, currency,
      is_new_arrival, is_bestseller, available_for_ar,
      category:categories(name, slug),
      media:product_media(url, alt_text, is_primary)
    `,
      { count: 'exact' },
    )
    .eq('status', 'active');

  if (options.categorySlug) {
    query = query.eq('category.slug', options.categorySlug);
  }
  if (options.search) {
    query = query.ilike('name', `%${options.search}%`);
  }
  if (options.featured) {
    query = query.eq('is_featured', true);
  }
  if (options.newArrivals) {
    query = query.eq('is_new_arrival', true);
  }

  // Sorting
  switch (options.sortBy) {
    case 'price_asc':
      query = query.order('base_price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('base_price', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);

  if (error) throw error;

  return {
    products: data as unknown as ProductCard[],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getProductBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories(*),
      media:product_media(*),
      models_3d:product_3d_models(*),
      materials:product_materials(*, material:materials(*)),
      dimensions:product_dimensions(*),
      care_guides:care_guides(*),
      inventory:inventory(*)
    `,
    )
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error) return null;
  return data as unknown as Product;
}

export async function getFeaturedProducts(
  supabase: SupabaseClient,
  limit = 8,
) {
  return getProducts(supabase, { featured: true, limit });
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(
  supabase: SupabaseClient,
): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as Category[];
}

export async function getCategoryBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Category;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function getOrCreateCart(
  supabase: SupabaseClient,
  userId?: string,
  sessionId?: string,
): Promise<Cart> {
  // Try to find existing cart
  let query = supabase.from('carts').select('*, items:cart_items(*, product:products(*), material:materials(*))');

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (sessionId) {
    query = query.eq('session_id', sessionId);
  } else {
    throw new Error('Either userId or sessionId is required');
  }

  const { data: existing } = await query.single();

  if (existing) return existing as unknown as Cart;

  // Create new cart
  const { data: newCart, error } = await supabase
    .from('carts')
    .insert({ user_id: userId, session_id: sessionId })
    .select('*, items:cart_items(*)')
    .single();

  if (error) throw error;
  return newCart as unknown as Cart;
}

export async function addToCart(
  supabase: SupabaseClient,
  cartId: string,
  productId: string,
  unitPrice: number,
  materialId?: string,
  quantity = 1,
): Promise<CartItem> {
  // Check if item already exists
  let query = supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cartId)
    .eq('product_id', productId);

  if (materialId) {
    query = query.eq('material_id', materialId);
  } else {
    query = query.is('material_id', null);
  }

  const { data: existing } = await query.single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) throw error;
    return data as CartItem;
  }

  // Insert new item
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      cart_id: cartId,
      product_id: productId,
      material_id: materialId,
      quantity,
      unit_price: unitPrice,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as CartItem;
}

export async function removeFromCart(
  supabase: SupabaseClient,
  itemId: string,
) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

export async function updateCartItemQuantity(
  supabase: SupabaseClient,
  itemId: string,
  quantity: number,
) {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select('*')
    .single();

  if (error) throw error;
  return data as CartItem;
}

// ─── Wishlists ───────────────────────────────────────────────────────────────

export async function getUserWishlists(
  supabase: SupabaseClient,
  userId: string,
): Promise<Wishlist[]> {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*, items:wishlist_items(*, product:products(id, slug, name, base_price), material:materials(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as Wishlist[];
}

export async function addToWishlist(
  supabase: SupabaseClient,
  wishlistId: string,
  productId: string,
  materialId?: string,
) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .upsert(
      {
        wishlist_id: wishlistId,
        product_id: productId,
        material_id: materialId,
      },
      { onConflict: 'wishlist_id,product_id,material_id' },
    )
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function getProductReviews(
  supabase: SupabaseClient,
  productId: string,
  page = 1,
  limit = REVIEWS_PER_PAGE,
) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from('reviews')
    .select(
      '*, photos:review_photos(*), profile:profiles(full_name, avatar_url)',
      { count: 'exact' },
    )
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    reviews: data as unknown as Review[],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getReviewStats(
  supabase: SupabaseClient,
  productId: string,
): Promise<ReviewStats> {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true);

  if (error) throw error;

  const reviews = data ?? [];
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;

  reviews.forEach((r: { rating: number }) => {
    const key = r.rating as 1 | 2 | 3 | 4 | 5;
    distribution[key]++;
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / totalReviews
      : 0;

  return {
    product_id: productId,
    average_rating: Math.round(averageRating * 10) / 10,
    total_reviews: totalReviews,
    rating_distribution: distribution,
    photo_count: 0, // Would need a separate count query
  };
}

// ─── Curated Rooms ───────────────────────────────────────────────────────────

export async function getCuratedRooms(
  supabase: SupabaseClient,
): Promise<CuratedRoom[]> {
  const { data, error } = await supabase
    .from('curated_rooms')
    .select(
      '*, hotspots:curated_room_hotspots(*, product:products(id, slug, name, base_price, tagline))',
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as unknown as CuratedRoom[];
}

// ─── Shipping Zones ──────────────────────────────────────────────────────────

export async function getShippingZones(
  supabase: SupabaseClient,
): Promise<ShippingZone[]> {
  const { data, error } = await supabase
    .from('shipping_zones')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data as ShippingZone[];
}

// ─── Delivery Slots ──────────────────────────────────────────────────────────

export async function getAvailableDeliverySlots(
  supabase: SupabaseClient,
  regionCode: string,
  fromDate: string,
  toDate: string,
): Promise<DeliverySlot[]> {
  const { data, error } = await supabase
    .from('delivery_slots')
    .select('*')
    .eq('region_code', regionCode)
    .gte('date', fromDate)
    .lte('date', toDate)
    .eq('is_available', true)
    .order('date', { ascending: true });

  if (error) throw error;
  return data as DeliverySlot[];
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function getUserOrders(
  supabase: SupabaseClient,
  userId: string,
): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(id, slug, name))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as Order[];
}

// ─── Warranties ──────────────────────────────────────────────────────────────

export async function getUserWarranties(
  supabase: SupabaseClient,
  userId: string,
): Promise<Warranty[]> {
  const { data, error } = await supabase
    .from('warranties')
    .select('*, product:products(id, slug, name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as Warranty[];
}

// ─── B2B Inquiries ───────────────────────────────────────────────────────────

export async function createB2BInquiry(
  supabase: SupabaseClient,
  inquiry: Omit<B2BInquiry, 'id' | 'status' | 'assigned_to' | 'internal_notes' | 'quoted_amount' | 'quote_valid_until' | 'created_at' | 'updated_at'>,
) {
  const { data, error } = await supabase
    .from('b2b_inquiries')
    .insert(inquiry)
    .select('*')
    .single();

  if (error) throw error;
  return data as B2BInquiry;
}
