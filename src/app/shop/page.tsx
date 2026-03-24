import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ShoppingCart, Star, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* Header Storefront */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              S
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Storefront</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              Đăng nhập Admin
            </Link>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">0</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Cửa hàng trực tuyến</h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Khám phá các sản phẩm công nghệ mới nhất với giá cực kỳ ưu đãi. Mua sắm an toàn, giao hàng nhanh chóng.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-[4/3] relative bg-gray-50 dark:bg-gray-800 overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-medium">Chưa có ảnh</div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 rounded-full text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 shadow-sm">
                    {product.category.name}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current opacity-50" />
                  <span className="text-xs text-gray-500 ml-1">(12)</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 min-h-[40px]">
                  {product.description || 'Sản phẩm chính hãng với bảo hành toàn quốc 12 tháng.'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 line-through decoration-1">{formatCurrency(product.price * 1.15)}</p>
                    <p className="text-xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(product.price)}</p>
                  </div>
                  <Link href={`/checkout/${product.id}`} className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95">
                    Mua ngay
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Footer mộc */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-20 py-12 text-center text-gray-500">
        <p className="flex items-center justify-center gap-2"><ShieldCheck className="w-5 h-5"/> AdminPro E-Commerce Demo Project</p>
      </footer>
    </div>
  );
}
