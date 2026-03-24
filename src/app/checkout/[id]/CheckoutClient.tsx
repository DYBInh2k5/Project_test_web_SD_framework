'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createCustomerOrder } from '@/app/actions/customerActions';
import Link from 'next/link';

export default function CheckoutClient({ product }: { product: any }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'card'>('card');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Giả lập thời gian kết nối API ngân hàng (2.5 giây)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Lưu thẳng vào cơ sở dữ liệu Order
    const res = await createCustomerOrder(product.id, product.price, paymentMethod);
    
    setIsProcessing(false);
    if (res.success) {
      setPaymentSuccess(true);
    } else {
      alert("Lỗi thanh toán: " + res.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 text-center sticky top-0 z-40">
        <Link href="/shop" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Storefront AdminPro
        </Link>
        <p className="text-xs text-gray-500">Mô phỏng thanh toán trực tuyến</p>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence>
          {!paymentSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row"
            >
              {/* Cột Tổng Kết Đơn Hàng */}
              <div className="md:w-1/2 p-8 bg-gray-50/50 dark:bg-gray-800/20 border-r border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Đơn hàng của bạn</h2>
                
                <div className="space-y-4 mb-12">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1 cursor-help" title={product.description}>{product.description || 'Số lượng: 1'}</p>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white whitespace-nowrap truncate ml-2">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Tạm tính</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Phí giao hàng</span>
                    <span className="font-medium text-green-600 dark:text-green-400">Miễn phí</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
                    <span className="font-bold text-gray-900 dark:text-white text-lg">Tổng thanh toán</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-2xl">{formatCurrency(product.price)}</span>
                  </div>
                </div>
              </div>

              {/* Cột Chọn Phương Thức Thanh Toán */}
              <div className="md:w-1/2 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Chọn phương thức</h2>
                
                <div className="space-y-4">
                  <label className={`block relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-300">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Thẻ tín dụng / Ghi nợ</h4>
                        <p className="text-xs text-gray-500">Visa, Mastercard, JCB, Amex</p>
                      </div>
                      {paymentMethod === 'card' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    </div>
                    
                    <AnimatePresence>
                      {paymentMethod === 'card' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-3 overflow-hidden">
                          <input type="text" placeholder="Số thẻ (0000 0000 0000 0000)" className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm focus:border-blue-500" />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm focus:border-blue-500" />
                            <input type="text" placeholder="CVC" className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm focus:border-blue-500" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </label>

                  <label className={`block relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'vnpay' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 border border-gray-100">
                        <div className="font-bold text-blue-700 text-xs text-center leading-tight">VN<br/>PAY</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Mã QR Code / VNPay</h4>
                        <p className="text-xs text-gray-500">Quét mã qua app ngân hàng</p>
                      </div>
                      {paymentMethod === 'vnpay' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    </div>
                  </label>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full py-4 bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" /> Thanh toán {formatCurrency(product.price)}
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4 flex justify-center items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Giao dịch được bảo mật bởi MockGateway
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl text-center border border-gray-100 dark:border-gray-800"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thanh toán thành công!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Đơn hàng của bạn đã được chuyển vào hệ thống. Bạn có thể quay lại trang Quản trị để thấy đơn hàng mới trong danh sách.
              </p>
              <div className="flex gap-3">
                <Link 
                  href="/shop"
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors"
                >
                  Mua thêm
                </Link>
                <Link 
                  href="/dashboard/orders"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Vào Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
