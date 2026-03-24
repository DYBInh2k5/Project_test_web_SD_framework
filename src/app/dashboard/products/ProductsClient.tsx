'use client';

import { useState } from 'react';
import { addProduct, updateProduct, deleteProduct, addCategory } from '@/app/actions/productActions';
import { 
  Plus, Edit, Trash2, Tag, Default, Search, PackageSearch, Image as ImageIcon, X, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ProductType = any;
type CategoryType = any;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function ProductsClient({ products, categories }: { products: ProductType[], categories: CategoryType[] }) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  
  // States Modal Sản phẩm
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States form Sản phẩm
  const [pdName, setPdName] = useState('');
  const [pdPrice, setPdPrice] = useState('');
  const [pdDesc, setPdDesc] = useState('');
  const [pdImage, setPdImage] = useState('');
  const [pdCategory, setPdCategory] = useState(categories[0]?.id || '');

  // State Thể loại nhanh
  const [newCatName, setNewCatName] = useState('');

  // Lọc sản phẩm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setPdName('');
    setPdPrice('');
    setPdDesc('');
    setPdImage('');
    setPdCategory(categories[0]?.id || '');
    setIsProductModalOpen(true);
  };

  const openEditModal = (p: ProductType) => {
    setEditingProduct(p);
    setPdName(p.name);
    setPdPrice(p.price.toString());
    setPdDesc(p.description || '');
    setPdImage(p.imageUrl || '');
    setPdCategory(p.categoryId);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      name: pdName, price: pdPrice, description: pdDesc, imageUrl: pdImage, categoryId: pdCategory
    };
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    setIsSubmitting(false);
    setIsProductModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      await deleteProduct(id);
    }
  };

  const handleAddQuickCategory = async () => {
    if (!newCatName.trim()) return;
    await addCategory(newCatName, 'Danh mục mới');
    setNewCatName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sản phẩm & Danh mục</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý kho hàng của bạn</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('products')}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", activeTab === 'products' ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow" : "text-gray-500 hover:text-gray-900")}
          >
            Sản phẩm
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", activeTab === 'categories' ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow" : "text-gray-500 hover:text-gray-900")}
          >
            Danh mục
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm sản phẩm..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              />
            </div>
            <button onClick={openAddModal} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm shadow-blue-500/20 active:scale-95">
              <Plus className="w-5 h-5" /> Thêm sản phẩm
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <motion.div layoutId={`product-${p.id}`} key={p.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all">
                <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs">Chưa có ảnh</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {p.category.name}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => openEditModal(p)} className="p-2 bg-white text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1" title={p.name}>{p.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{formatCurrency(p.price)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 bg-white/50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <PackageSearch className="w-12 h-12 mb-3 opacity-20" />
                <p>Không tìm thấy sản phẩm nào.</p>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 md:w-1/2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thêm danh mục nhanh</h3>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Tên danh mục mới..." 
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
              <button 
                onClick={handleAddQuickCategory}
                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-xl transition-all"
              >
                Thêm
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c: any) => (
              <div key={c.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-500 transition-colors cursor-pointer flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{c.name}</h4>
                  <p className="text-xs text-gray-500">{c.description || 'Không mô tả'}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* MODAL Thêm/Sửa Sản phẩm */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h2>
                <button onClick={() => setIsProductModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên sản phẩm *</label>
                  <input required type="text" value={pdName} onChange={e => setPdName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá (VNĐ) *</label>
                    <input required type="number" value={pdPrice} onChange={e => setPdPrice(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục *</label>
                    <select value={pdCategory} onChange={e => setPdCategory(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white">
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Ảnh thật (Image URL)</label>
                  <input type="url" value={pdImage} onChange={e => setPdImage(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                  {pdImage && (
                    <div className="mt-2 h-32 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative group">
                      <img src={pdImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả chi tiết</label>
                  <textarea rows={3} value={pdDesc} onChange={e => setPdDesc(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white resize-none" />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                    Hủy bỏ
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm shadow-blue-500/20 disabled:opacity-70">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu sản phẩm'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
