'use client';

import { useState } from 'react';
import { updateUser, deleteUser } from '@/app/actions/userActions';
import { Edit, Trash2, Search, Shield, ShieldCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type UserType = any;

const RoleBadges: Record<string, { bg: string, text: string, icon: any }> = {
  admin: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: ShieldCheck },
  editor: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Shield },
  user: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', icon: User },
};

export default function UsersClient({ initialUsers }: { initialUsers: UserType[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // States Modal sửa User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States form
  const [uName, setUName] = useState('');
  const [uRole, setURole] = useState('');
  const [uPassword, setUPassword] = useState(''); // Chỉ nhập khi muốn đổi pass

  const filteredUsers = initialUsers.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (user: UserType) => {
    setEditingUser(user);
    setUName(user.name || '');
    setURole(user.role);
    setUPassword(''); 
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    
    const data = {
      name: uName,
      role: uRole,
      password: uPassword ? uPassword : undefined
    };
    
    await updateUser(editingUser.id, data);
    
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, role: string) => {
    if (role === 'admin') {
      alert('Không thể xóa tài khoản Admin.');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      const res = await deleteUser(id);
      if (!res.success) alert(res.error);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Thanh công cụ */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900">
          <div className="relative w-full max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm email hoặc tên..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Người dùng</th>
                <th className="px-6 py-4 whitespace-nowrap">Quyền (Role)</th>
                <th className="px-6 py-4 whitespace-nowrap">Ngày tham gia</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              )}

              {filteredUsers.map((u) => {
                const RoleInfo = RoleBadges[u.role] || RoleBadges.user;
                const Icon = RoleInfo.icon;
                return (
                  <tr key={u.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold uppercase shrink-0">
                          {u.name ? u.name[0] : u.email[0]}
                        </div>
                        <div>
                          <p>{u.name || 'Chưa cập nhật'}</p>
                          <p className="font-normal text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase", RoleInfo.bg, RoleInfo.text)}>
                        <Icon className="w-3.5 h-3.5" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(u)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/40 dark:text-blue-400 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id, u.role)}
                          disabled={u.role === 'admin'}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/40 dark:text-red-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL Cập nhật User */}
      <AnimatePresence>
        {isModalOpen && editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6">
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Chỉnh sửa hồ sơ: {editingUser.email}</h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên</label>
                  <input required type="text" value={uName} onChange={e => setUName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quyền (Role)</label>
                  <select value={uRole} onChange={e => setURole(e.target.value)} disabled={editingUser.role === 'admin'} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white disabled:opacity-50">
                    <option value="user">USER (Khách hàng)</option>
                    <option value="editor">EDITOR (Biên tập viên)</option>
                    <option value="admin">ADMIN (Quản trị hệ thống)</option>
                  </select>
                  {editingUser.role === 'admin' && <p className="text-xs text-red-500 mt-1">Không thể đổi role của Admin hiện tại.</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đổi mật khẩu mới (Nếu có)</label>
                  <input type="password" placeholder="Để trống nếu không muốn đổi" value={uPassword} onChange={e => setUPassword(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white placeholder:text-gray-400" />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                    Hủy bỏ
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm shadow-blue-500/20 disabled:opacity-70">
                    {isSubmitting ? 'Đang lưu...' : 'Lưu cập nhật'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
