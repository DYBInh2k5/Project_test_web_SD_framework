import { prisma } from '@/lib/prisma';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6">
      <ProductsClient products={products as any} categories={categories as any} />
    </div>
  );
}
