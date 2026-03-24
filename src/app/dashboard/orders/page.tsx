import { prisma } from '@/lib/prisma';
import OrdersClient from './OrdersClient';

// Tắt bộ nhớ cache để luôn lấy data mới nhất (quan trọng cho trang admin)
export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  // Lấy toàn bộ đơn hàng từ Database
  const orders = await prisma.order.findMany({
    include: {
      user: true, // Join bảng User để lấy thông tin khách hàng
      orderItems: {
        include: {
          product: true, // Join bảng Product để lấy tên/giá sản phẩm
        }
      }
    },
    orderBy: {
      createdAt: 'desc', // Mặc định sắp xếp từ mới đến cũ
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Đơn hàng</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Xem danh sách, lọc, và cập nhật trạng thái đơn hàng.
        </p>
      </div>

      <OrdersClient initialOrders={orders as any} />
    </div>
  );
}
