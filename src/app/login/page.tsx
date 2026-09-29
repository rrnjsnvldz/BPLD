import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Furnishara',
  description: 'Sign in to your Furnishara account to manage orders, wishlists, and warranty registrations.',
};

export default function LoginPage() {
  return <LoginForm />;
}
