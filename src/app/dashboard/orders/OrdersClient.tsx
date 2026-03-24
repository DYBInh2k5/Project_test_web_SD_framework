'use client';

import { useState, useMemo } from 'react';
import { updateOrderStatus } from '@/app/actions/orderActions';
import { 
  Search, Calendar, Filter, Eye, User, Phone, Mail, MapPin, PackageOpen, CreditCard, ChevronRight, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type OrderType = any;

const StatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function OrdersClient({ initialOrders }: { initialOrders: OrderType[] }) {
  const [orders, setOrders] = useState(initialOrders);
  
  // States cho việc lọc (Filtering)
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // States cho modal xem chi tiết
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  // Xử lý Lọc Dữ liệu (Real-time Client Filtering)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Lọc trạng thái
      if (filterStatus !== 'all' && order.status !== filterStatus) return false;

      // Lọc theo ngày (Creation Date)
      const orderDate = new Date(order.createdAt).getTime();
      if (dateFrom) {
        const fromTime = new Date(dateFrom).getTime();
        if (orderDate < fromTime) return false;
      }
      if (dateTo) {
        // Cộng thêm 1 ngày để lấy trọn ngày To (23:59:59)
        const toTime = new Date(dateTo).getTime() + (24 * 60 * 60 * 1000);
        if (orderDate >= toTime) return false;
      }

      return true;
    });
  }, [orders, filterStatus, dateFrom, dateTo]);

  // Cập nhật trạng thái bằng Server Action
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistic UI Update (Update giao diện trước cho nhanh)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // Gọi API lưu DB
    const res = await updateOrderStatus(orderId, newStatus);
    if (!res.success) {
      alert("Đã có lỗi xảy ra khi cập nhật!");
      // Nếu lỗi, có thể lùi state lại (tự thêm logic nếu cần)
    }
  };

  return (
    <>
      {/* Khối Bộ Lọc (Filters) */}
      <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col md:flex-row gap-4 shadow-sm items-end md:items-center">
        
        {/* Lọc Tag Trạng Thái */}
        <div className="flex-1 w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-500" /> Trạng thái
          </label>
          <select 
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận (Pending)</option>
            <option value="processing">Đang xử lý (Processing)</option>
            <option value="shipped">Đang giao hàng (Shipped)</option>
            <option value="delivered">Đã giao (Delivered)</option>
            <option value="cancelled">Đã hủy (Cancelled)</option>
          </select>
        </div>

        {/* Lọc Theo Khoảng Thời Gian */}
        <div className="flex-1 w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" /> Từ ngày
          </label>
          <input 
            type="date"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:light] dark:[color-scheme:dark]"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="flex-1 w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" /> Đến ngày
          </label>
          <input 
            type="date"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:light] dark:[color-scheme:dark]"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

      </div>

      {/* Bảng Hiển Thị (Table) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Mã Đơn</th>
                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Thời gian tạo</th>
                <th className="px-6 py-4 whitespace-nowrap">Tổng tiền</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Trạng thái</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-20" />
                      <p>Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</p>
                    </div>
                  </td>
                </tr>
              ) : null}

              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{order.user.name}</div>
                    <div className="text-xs text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    <div className="text-xs">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={cn(
                          "appearance-none text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer tracking-wide border-2 border-transparent focus:border-blue-500 transition-all text-center",
                          StatusColors[order.status] || "bg-gray-100 text-gray-700"
                        )}
                      >
                        <option value="pending">PENDING</option>
                        <option value="processing">PROCESSING</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors inline-block"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL Xem chi tiết Đơn hàng (Hiển thị nổi) */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col"
            >
              {/* Header Modal */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Chi tiết đơn hàng <span className="text-blue-600 dark:text-blue-400">#{selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nội dung bên trong */}
              <div className="p-6 space-y-8">
                {/* Section Khách Hàng (Customer Info from Order Detail page) */}
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-5 border border-blue-100/50 dark:border-blue-900/30">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Thông tin khách hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Họ và tên</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Sản Phẩm */}
                <div>
                  <h3 className="text-sm uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <PackageOpen className="w-4 h-4" /> Sản phẩm đã mua ({selectedOrder.orderItems.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item: any) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm relative">
                          {item.product.imageUrl ? (
                            <img src={item.product.imageUrl} className="w-full h-full object-cover" alt="Product" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">IMG</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.product.name}</h4>
                          <div className="flex justify-between items-end mt-2">
                            <span className="text-sm text-gray-500">
                              {formatCurrency(item.price)} <span className="font-medium">x {item.quantity}</span>
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Tổng Kết */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                  <div className="flex justify-between items-center bg-gray-900 dark:bg-gray-800 text-white p-5 rounded-2xl shadow-lg shadow-gray-900/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">Tổng thanh toán</p>
                        <p className="text-xs text-gray-400 mt-0.5">Phương thức: <span className="uppercase text-white font-bold">{selectedOrder.paymentMethod}</span></p>
                      </div>
                    </div>
                    <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
