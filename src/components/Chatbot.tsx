'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = { id: number; text: string; sender: 'user' | 'bot' };

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Xin chào! Mình là trợ lý ảo AdminPro. Bạn cần hỗ trợ gì ạ?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    // Xử lý auto-reply đơn giản (Mô phỏng AI)
    setTimeout(() => {
      let botResponse = 'Dạ mình đã ghi nhận thông tin. Sẽ có nhân viên liên hệ lại sớm nhất ạ.';
      
      const lowerInput = userMsg.toLowerCase();
      if (lowerInput.includes('giá') || lowerInput.includes('tiền')) {
        botResponse = 'Về vấn đề giá cả, bạn vui lòng xem chi tiết từng sản phẩm tại cửa hàng nhé hoặc để lại SĐT ạ.';
      } else if (lowerInput.includes('đơn hàng') || lowerInput.includes('vận chuyển')) {
        botResponse = 'Đơn hàng sẽ được xử lý trong vòng 24h và giao đến bạn từ 2-4 ngày làm việc ạ.';
      } else if (lowerInput.includes('thanh toán')) {
        botResponse = 'Hệ thống hỗ trợ thanh toán qua Thẻ tín dụng (Stripe) hoặc VNPay. Bạn có thể thanh toán trực tuyến dễ dàng!';
      } else if (lowerInput.includes('chào') || lowerInput.includes('hi')) {
        botResponse = 'Dạ chào bạn, bạn cần mình giúp gì về sản phẩm hay đơn hàng không?';
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Nút bật/tắt chatbot */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Cửa sổ Chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Hỗ trợ trực tuyến</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs text-blue-100">Đang hoạt động</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung chat */}
            <div className="flex-1 max-h-96 min-h-[300px] overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-900/50 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 flex items-center justify-center shrink-0 shadow-sm border border-white dark:border-gray-800">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    </div>
                  )}
                  
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'}`}>
                    {msg.text}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 shadow-sm border border-white dark:border-gray-800">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 flex items-center justify-center shrink-0 shadow-sm border border-white dark:border-gray-800">
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="px-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Khung nhập liệu */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:bg-gray-900 rounded-xl px-4 py-2 outline-none text-sm transition-all dark:text-white"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
