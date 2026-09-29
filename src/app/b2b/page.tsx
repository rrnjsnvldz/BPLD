import type { Metadata } from 'next';
import { B2BForm } from '@/components/auth/B2BForm';

export const metadata: Metadata = {
  title: 'Custom & Bulk Orders | Furnishara',
  description: 'Request a quote for custom-sized, bespoke, or bulk furniture orders. We design and build to your exact specifications.',
};

export default function B2BPage() {
  return <B2BForm />;
}
