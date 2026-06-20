'use client';
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { subscribeToAllProducts, addProduct, updateProduct, deleteProduct, toggleActive, PRODUCT_CATEGORIES } from "@/supabase/products";
import { subscribeToAllOrders, updateOrderStatus } from "@/supabase/orders";
import { signOut, onAuthChange } from "@/supabase/auth";
import { uploadProductImage } from "@/supabase/storage";
import { Edit2, Trash2, Check, X, Eye, EyeOff, Plus, List, LogOut, Search, ClipboardList, Upload, Loader2 } from 'lucide-react';
import { handleImgError } from "@/utils/imageHelpers";

function ImageUploader({ imageUrl, onUploaded, error }) {
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(imageUrl || '');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    setPreview(imageUrl || '');
  }, [imageUrl]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('الملف يجب أن يكون صورة (jpg, png, webp...)');
      return;
    }

    setUploadError('');
    setPreview(URL.createObjectURL(file));
    setProcessing(true);

    try {
      const url = await uploadProductImage(file);
      setPreview(url);
      onUploaded(url);
    } catch (err) {
      setUploadError('فشل رفع الصورة: ' + (err.message || 'خطأ غير معروف'));
      setPreview(imageUrl || '');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <label className="block text-gray-700 mb-2 font-bold">صورة المنتج</label>
      <div className="flex items-center gap-2 mb-3">
        <Upload size={16} className="text-blue-600" />
        <span className="text-sm text-gray-600">اختر صورة من جهازك (سيتم رفعها إلى التخزين السحابي)</span>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-gray-300 rounded-lg p-3 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium file:cursor-pointer"
      />

      {processing && (
        <div className="flex items-center gap-2 mt-2">
          <Loader2 size={16} className="text-blue-600 animate-spin" />
          <p className="text-sm text-blue-600 font-medium">جاري معالجة الصورة...</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>}
      {uploadError && <p className="text-red-500 text-sm mt-1 font-medium">{uploadError}</p>}

      {preview && !processing && (
        <div className="mt-3">
          <img src={preview} alt="معاينة" className="w-24 h-24 object-cover rounded-lg border shadow-sm" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      )}
    </div>
  );
}

function OptionsManager({ options, onChange }) {
  const addGroup = () => {
    onChange([...options, { id: Date.now().toString(), title: '', values: [] }]);
  };

  const removeGroup = (idx) => {
    onChange(options.filter((_, i) => i !== idx));
  };

  const updateTitle = (idx, title) => {
    const updated = [...options];
    updated[idx] = { ...updated[idx], title };
    onChange(updated);
  };

  const addValue = (idx, value) => {
    if (!value.trim()) return;
    const updated = [...options];
    updated[idx] = { ...updated[idx], values: [...updated[idx].values, value.trim()] };
    onChange(updated);
  };

  const removeValue = (groupIdx, valIdx) => {
    const updated = [...options];
    updated[groupIdx] = { ...updated[groupIdx], values: updated[groupIdx].values.filter((_, i) => i !== valIdx) };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {options.map((group, idx) => (
        <div key={group.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="text"
              value={group.title}
              onChange={e => updateTitle(idx, e.target.value)}
              placeholder="عنوان الخيار (مثال: السعة التخزينية، الموديل)"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeGroup(idx)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
              title="حذف المجموعة"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {group.values.map((val, vIdx) => (
              <span key={vIdx} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {val}
                <button
                  type="button"
                  onClick={() => removeValue(idx, vIdx)}
                  className="text-blue-600 hover:text-red-600 transition"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <OptionValueInput onAdd={(val) => addValue(idx, val)} />
        </div>
      ))}
      <button
        type="button"
        onClick={addGroup}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-sm transition"
      >
        <Plus size={16} /> إضافة مجموعة خيارات
      </button>
    </div>
  );
}

function OptionValueInput({ onAdd }) {
  const [value, setValue] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="أضف قيمة جديدة..."
        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition"
      >
        + إضافة
      </button>
    </form>
  );
}

function ColorsManager({ colors, onChange }) {
  const colorInputRef = React.useRef(null);

  const handleColorPicked = (e) => {
    const hex = e.target.value;
    if (!colors.includes(hex)) {
      onChange([...colors, hex]);
    }
  };

  const handleRemove = (idx) => {
    onChange(colors.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {colors.map((color, idx) => (
          <div key={idx} className="relative group">
            <div
              className="w-9 h-9 rounded-full border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => colorInputRef.current?.click()}
          className="w-9 h-9 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition"
          title="أضف لون"
        >
          <Plus size={16} />
        </button>
        <input
          ref={colorInputRef}
          type="color"
          onChange={handleColorPicked}
          className="sr-only"
        />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const [tab, setTab] = useState("list");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const initialForm = {
    name: '',
    category: 'phone',
    price: '',
    imageUrl: '',
    stock: '',
    isActive: true,
    hasColors: false,
    colors: [],
    specs: '',
    customOptions: [],
  };
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToAllProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (searchQuery && !p.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterCategory && p.category !== filterCategory) return false;
      return true;
    });
  }, [products, searchQuery, filterCategory]);

  const validateForm = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = 'اسم المنتج مطلوب';
    if (!data.price || Number(data.price) <= 0) errors.price = 'السعر يجب أن يكون أكبر من 0';
    if (!data.imageUrl?.trim()) errors.imageUrl = 'صورة المنتج مطلوبة';
    if (data.stock === '' || Number(data.stock) < 0) errors.stock = 'المخزون يجب أن يكون 0 أو أكثر';
    return errors;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setError(null);
    try {
      await addProduct({
        name: form.name.trim(),
        price: Number(form.price),
        imageUrl: form.imageUrl.trim(),
        category: form.category,
        stock: Number(form.stock),
        isActive: form.isActive,
        colors: form.hasColors ? form.colors : [],
        specs: form.specs.trim(),
        customOptions: form.customOptions.filter(g => g.title.trim() && g.values.length > 0),
      });
      setSuccessMsg('تمت إضافة المنتج بنجاح!');
      setForm(initialForm);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name || '',
      category: product.category || 'phone',
      price: product.price || '',
      imageUrl: product.imageUrl || '',
      stock: product.stock ?? '',
      isActive: product.isActive !== false,
      hasColors: (product.colors || []).length > 0,
      colors: product.colors || [],
      specs: product.specs || '',
      customOptions: product.customOptions || [],
    });
  };

  const handleSaveEdit = async () => {
    const errors = validateForm(editForm);
    if (Object.keys(errors).length > 0) {
      setError('يرجى التحقق من صحة البيانات المُدخلة');
      return;
    }

    try {
      setError(null);
      await updateProduct(editingId, {
        name: editForm.name.trim(),
        price: Number(editForm.price),
        imageUrl: editForm.imageUrl.trim(),
        category: editForm.category,
        stock: Number(editForm.stock),
        isActive: editForm.isActive,
        colors: editForm.hasColors ? editForm.colors : [],
        specs: editForm.specs.trim(),
        customOptions: (editForm.customOptions || []).filter(g => g.title.trim() && g.values.length > 0),
      });
      setEditingId(null);
      setSuccessMsg('تم تعديل المنتج بنجاح!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('فشل حفظ التعديلات: ' + (err.message || 'خطأ غير معروف'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      try {
        await deleteProduct(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await toggleActive(product.id, product.isActive);
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
      <div className="admin-page max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setTab('list')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold transition ${
              tab === 'list' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <List size={20} /> المنتجات
          </button>
          <button
            onClick={() => setTab('add')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold transition ${
              tab === 'add' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <Plus size={20} /> إضافة منتج
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold transition ${
              tab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <ClipboardList size={20} /> الطلبات
          </button>
        </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} /> تسجيل خروج
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 font-medium">{error}</div>}
        {successMsg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 font-medium">{successMsg}</div>}

        {tab === 'list' && (
          <div>
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="بحث باسم المنتج..."
                    className="w-full border border-gray-300 rounded-lg pr-10 pl-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white min-w-[130px]"
                >
                  <option value="">كل الفئات</option>
                  {PRODUCT_CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.labelAr}</option>)}
                </select>
              </div>
              {(searchQuery || filterCategory) && (
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                  <span>النتائج: {filteredProducts.length} منتج</span>
                  <button
                    onClick={() => { setSearchQuery(''); setFilterCategory(''); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    مسح الفلاتر
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500 font-medium">جاري تحميل المنتجات...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-4 font-bold text-gray-700">الصورة</th>
                        <th className="p-4 font-bold text-gray-700">الاسم</th>
                        <th className="p-4 font-bold text-gray-700 hidden lg:table-cell">الفئة</th>
                        <th className="p-4 font-bold text-gray-700">السعر</th>
                        <th className="p-4 font-bold text-gray-700">المخزون</th>
                        <th className="p-4 font-bold text-gray-700">الحالة</th>
                        <th className="p-4 font-bold text-gray-700 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => {
                        const isEditing = editingId === product.id;
                        const p = isEditing ? editForm : product;

                        return (
                          <React.Fragment key={product.id}>
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="p-4">
                              <img loading="lazy" src={p.imageUrl || ''} alt={p.name} className="w-12 h-12 object-cover rounded-lg border shadow-sm" onError={handleImgError} />
                            </td>
                            <td className="p-4 font-medium text-gray-900">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={p.name}
                                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                                  className="border rounded p-2 w-full max-w-[180px] outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : p.name}
                            </td>
                            <td className="p-4 hidden lg:table-cell text-gray-600">
                              {isEditing ? (
                                <select
                                  value={p.category || 'phone'}
                                  onChange={e => setEditForm({...editForm, category: e.target.value})}
                                  className="border rounded p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {PRODUCT_CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.labelAr}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                  {PRODUCT_CATEGORIES.find(c => c.value === p.category)?.labelAr || p.category || '—'}
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-bold text-gray-800">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={p.price}
                                  onChange={e => setEditForm({...editForm, price: e.target.value})}
                                  className="border rounded p-2 w-20 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : `$${p.price}`}
                            </td>
                            <td className="p-4">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={p.stock}
                                  onChange={e => setEditForm({...editForm, stock: e.target.value})}
                                  className="border rounded p-2 w-20 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className={`font-bold ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {p.stock}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleToggleActive(product)}
                                className={`p-2 rounded-full transition shadow-sm ${product.isActive ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-gray-500 bg-gray-200 hover:bg-gray-300'}`}
                                disabled={isEditing}
                                title={product.isActive ? "نشط" : "مخفي"}
                              >
                                {product.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                              </button>
                            </td>
                            <td className="p-4 flex gap-2 justify-center">
                              {isEditing ? (
                                <>
                                  <button onClick={handleSaveEdit} className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-lg transition shadow-sm" title="حفظ">
                                    <Check size={18} />
                                  </button>
                                  <button onClick={() => setEditingId(null)} className="text-gray-600 bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition shadow-sm" title="إلغاء">
                                    <X size={18} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleEditClick(product)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition shadow-sm" title="تعديل">
                                    <Edit2 size={18} />
                                  </button>
                                  <button onClick={() => handleDelete(product.id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition shadow-sm" title="حذف">
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                          {isEditing && (
                            <tr className="border-b border-gray-100 bg-blue-50/30">
                              <td colSpan="7" className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                                  <div>
                                    <ImageUploader
                                      imageUrl={editForm.imageUrl}
                                      onUploaded={(url) => setEditForm({...editForm, imageUrl: url})}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-gray-700 mb-1 text-sm font-bold">المواصفات</label>
                                    <textarea
                                      value={editForm.specs || ''}
                                      onChange={e => setEditForm({...editForm, specs: e.target.value})}
                                      rows={3}
                                      className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                      placeholder="RAM: 8GB, Storage: 256GB, Battery: 5000mAh"
                                    />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-3 mb-2">
                                      <input
                                        type="checkbox"
                                        id={`colors-toggle-${product.id}`}
                                        checked={editForm.hasColors}
                                        onChange={e => setEditForm({...editForm, hasColors: e.target.checked, colors: e.target.checked ? editForm.colors : []})}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                      />
                                      <label htmlFor={`colors-toggle-${product.id}`} className="text-gray-700 font-bold text-sm cursor-pointer">
                                        هل يحتوي على ألوان؟
                                      </label>
                                    </div>
                                    {editForm.hasColors && (
                                      <ColorsManager
                                        colors={editForm.colors || []}
                                        onChange={(colors) => setEditForm({...editForm, colors})}
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-gray-700 mb-1 text-sm font-bold">خيارات المنتج</label>
                                    <OptionsManager
                                      options={editForm.customOptions || []}
                                      onChange={(customOptions) => setEditForm({...editForm, customOptions})}
                                    />
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      id={`active-${product.id}`}
                                      checked={editForm.isActive}
                                      onChange={e => setEditForm({...editForm, isActive: e.target.checked})}
                                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor={`active-${product.id}`} className="text-gray-800 font-bold cursor-pointer text-sm">
                                      نشط (يظهر في المتجر)
                                    </label>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                          </React.Fragment>
                        );
                      })}
                      {filteredProducts.length === 0 && !loading && (
                        <tr>
                          <td colSpan="7" className="p-12 text-center text-gray-500 font-medium">
                            {products.length === 0 ? 'لا توجد منتجات حالياً. أضف منتجاً جديداً للبدء!' : 'لا توجد نتائج مطابقة للبحث'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'add' && (
          <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">إضافة منتج جديد</h2>
            <form onSubmit={handleAddSubmit} className="space-y-5">

              <div>
                <label className="block text-gray-700 mb-2 font-bold">اسم المنتج</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g. iPhone 15 Pro Max 256GB"
                  dir="ltr"
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 mb-2 font-bold">نوع المنتج (الفئة)</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.labelAr} — {cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-bold">السعر (بالدولار $)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({...form, price: e.target.value})}
                    className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="مثال: 999"
                  />
                  {formErrors.price && <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.price}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-bold">المخزون (العدد المتوفر)</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({...form, stock: e.target.value})}
                    className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.stock ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="مثال: 10"
                  />
                  {formErrors.stock && <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.stock}</p>}
                </div>
              </div>

              <ImageUploader
                imageUrl={form.imageUrl}
                onUploaded={(url) => setForm({...form, imageUrl: url})}
                error={formErrors.imageUrl}
              />

              <div>
                <label className="block text-gray-700 mb-2 font-bold">المواصفات (اختياري)</label>
                <textarea
                  value={form.specs}
                  onChange={e => setForm({...form, specs: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="RAM: 8GB, Storage: 256GB, Battery: 5000mAh"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="hasColors"
                    checked={form.hasColors}
                    onChange={e => setForm({...form, hasColors: e.target.checked, colors: e.target.checked ? form.colors : []})}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="hasColors" className="text-gray-700 font-bold cursor-pointer">هل يحتوي هذا المنتج على ألوان؟</label>
                </div>
                {form.hasColors && (
                  <ColorsManager
                    colors={form.colors}
                    onChange={(colors) => setForm({...form, colors})}
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-bold">خيارات المنتج (اختياري)</label>
                <p className="text-sm text-gray-500 mb-3">أضف خيارات مخصصة مثل: السعة التخزينية، الموديل، المقاس...</p>
                <OptionsManager
                  options={form.customOptions}
                  onChange={(customOptions) => setForm({...form, customOptions})}
                />
              </div>

              <div className="flex items-center gap-3 mt-4 bg-gray-50 p-4 rounded-lg border">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={e => setForm({...form, isActive: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-gray-800 font-bold cursor-pointer">إظهار المنتج في المتجر للزوار</label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors shadow-md mt-6 flex justify-center items-center gap-2"
              >
                <Plus size={20} />
                حفظ المنتج في قاعدة البيانات
              </button>

            </form>
          </div>
        )}

        {tab === 'orders' && <OrdersTab />}

      </div>
    </div>
  );
}

const ORDER_STATUSES = [
  { value: "pending", label: "تم استلام الطلب" },
  { value: "processing", label: "قيد التجهيز" },
  { value: "shipped", label: "تم الشحن" },
  { value: "delivered", label: "تم التسليم" },
];

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (docId, newStatus) => {
    setUpdatingId(docId);
    try {
      await updateOrderStatus(docId, newStatus);
      setSuccessMsg('تم تحديث حالة الطلب بنجاح');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert("فشل تحديث الحالة: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("ar-LB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-medium">جاري تحميل الطلبات...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-medium">{error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">إدارة الطلبات ({orders.length})</h2>
      </div>

      {successMsg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 font-medium">{successMsg}</div>}

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500 font-medium">
          لا توجد طلبات حالياً
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold text-gray-700">رقم الطلب</th>
                  <th className="p-4 font-bold text-gray-700">العميل</th>
                  <th className="p-4 font-bold text-gray-700 hidden md:table-cell">المدينة</th>
                  <th className="p-4 font-bold text-gray-700">المنتجات</th>
                  <th className="p-4 font-bold text-gray-700">المجموع</th>
                  <th className="p-4 font-bold text-gray-700">الحالة</th>
                  <th className="p-4 font-bold text-gray-700 hidden md:table-cell">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-sm font-bold text-blue-600">
                      {order.orderNumber || order.id.slice(0, 8)}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{order.customerName || "—"}</div>
                      <div className="text-xs text-gray-500">{order.customerPhone || ""}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-gray-600">
                      {order.city || "—"}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 max-w-[200px]">
                        {(order.items || []).slice(0, 3).map((item, i) => (
                          <div key={i} className="text-sm text-gray-700 truncate">
                            {item.name} <span className="text-gray-400">×{item.quantity}</span>
                          </div>
                        ))}
                        {(order.items || []).length > 3 && (
                          <div className="text-xs text-gray-400">+{order.items.length - 3} منتجات أخرى</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-800">${order.total || 0}</td>
                    <td className="p-4">
                      <select
                        value={order.status || "pending"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px] ${
                          updatingId === order.id ? "opacity-50 cursor-wait" : "cursor-pointer"
                        }`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

