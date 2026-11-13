'use client';
/**
 * User Creation Form
 * Form for creating new user accounts with role assignment
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showToast } from '@/lib/utils/toast';
import { createUser } from '@/lib/platform/auth/user-actions';
import { createUserSchema } from '@/lib/platform/auth/schemas';
import type { Role } from '@/lib/platform/types';

// Extend schema to include confirm password validation
const formSchema = createUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

interface UserCreateFormProps {
  availableRoles: Role[];
}

export function UserCreateForm({ availableRoles }: UserCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role_ids: [],
    },
  });

  const selectedRoles = watch('role_ids') || [];

  const handleRoleToggle = (roleId: number, checked: boolean) => {
    const currentRoles = selectedRoles;
    if (checked) {
      setValue('role_ids', [...currentRoles, roleId]);
    } else {
      setValue('role_ids', currentRoles.filter((id) => id !== roleId));
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const result = await createUser({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        password: data.password,
        role_ids: data.role_ids,
      });

      if (result.error) {
        showToast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      showToast.success('User created successfully');
      router.push('/admin/users');
    } catch (error) {
      console.error('Error creating user:', error);
      showToast.error('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white max-w-2xl">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Enter the details for the new user account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              type="text"
              autoComplete="name"
              disabled={isSubmitting}
              {...register('full_name')}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              disabled={isSubmitting}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              disabled={isSubmitting}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              disabled={isSubmitting}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Roles */}
          <div className="space-y-3">
            <Label>
              Roles <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2 border rounded-md p-4 bg-gray-50">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={(checked) =>
                      handleRoleToggle(role.id, checked as boolean)
                    }
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor={`role-${role.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.role_ids && (
              <p className="text-sm text-destructive">{errors.role_ids.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              asChild
            >
              <Link href="/admin/users">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
