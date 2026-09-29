import type { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account | Furnishara',
  description: 'Create your Furnishara account for wishlists, order tracking, warranty registration, and exclusive offers.',
};

export default function SignupPage() {
  return <SignupForm />;
}
