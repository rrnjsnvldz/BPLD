/**
 * Zod schemas for authentication and user management.
 */
import { z } from 'zod';

/**
 * Schema for creating a new user.
 * Used by admin to create user accounts with roles.
 */
export const createUserSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().nullable().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role_ids: z.array(z.number()).min(1, 'At least one role is required'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
