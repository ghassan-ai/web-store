'use client';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'حذف', loading = false }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 min-h-[44px] bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 min-h-[44px] bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 font-medium rounded-xl transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
