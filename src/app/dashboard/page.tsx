'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Users, DollarSign, TrendingUp, PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { title: 'Tổng Doanh Thu', value: '124,500,000 đ', icon: DollarSign, change: '+12.5%', isUp: true },
  { title: 'Đơn Hàng Mới', value: '342', icon: ShoppingBag, change: '+5.2%', isUp: true },
  { title: 'Khách Hàng', value: '1,234', icon: Users, change: '-1.1%', isUp: false },
  { title: 'Sản Phẩm', value: '89', icon: PackageSearch, change: '0%', isUp: true },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Tổng quan hệ thống
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Theo dõi doanh số và hoạt động cửa hàng hôm nay.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full group-hover:scale-110 transition-transform duration-500" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-sm font-medium flex items-center gap-1",
                  stat.isUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {stat.change}
                  {stat.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                </span>
              </div>
              
              <div className="relative z-10">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Orders Table (Demo) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Đơn hàng gần đây</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { id: '#ORD-001', name: 'Nguyễn Văn A', date: '20/10/2023', status: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', total: '1,200,000 đ' },
                { id: '#ORD-002', name: 'Trần Thị B', date: '19/10/2023', status: 'Shipped', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', total: '450,000 đ' },
                { id: '#ORD-003', name: 'Lê Hoàng C', date: '18/10/2023', status: 'Delivered', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', total: '3,500,000 đ' },
                { id: '#ORD-004', name: 'Phạm D', date: '17/10/2023', status: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', total: '150,000 đ' },
              ].map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                  <td className="px-6 py-4">{order.name}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", order.color)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
