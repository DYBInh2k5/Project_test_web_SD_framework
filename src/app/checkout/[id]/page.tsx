import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

export const dynamic = 'force-dynamic';

export default async function CheckoutProductPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15+, params is a Promise. We must await it.
    const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  return <CheckoutClient product={product as any} />;
}
