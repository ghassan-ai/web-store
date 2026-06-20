'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { handleImgError } from "@/utils/imageHelpers";

export default function CartDrawer({ open, onClose }) {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { isAr } = useLang();
  const router = useRouter();

  const subtotal = cartItems.reduce((t, item) => t + item.price * item.quantity, 0);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />}
      <aside className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card border-l border-card-border shadow-2xl transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-card-border">
            <h2 className="font-bold text-lg text-white font-tajawal">
              {isAr ? "سلة المشتريات" : "Cart"} ({cartItems.reduce((s, i) => s + i.quantity, 0)})
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center">
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary px-6">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 border border-card-border">
                <ShoppingBag size={32} className="text-text-secondary" />
              </div>
              <p className="text-lg font-medium text-text-secondary font-tajawal">
                {isAr ? "السلة فارغة" : "Your cart is empty"}
              </p>
              <p className="text-sm text-text-secondary/70 mt-1 font-tajawal">
                {isAr ? "أضف منتجات للبدء بالتسوق" : "Add products to start shopping"}
              </p>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.cartKey || item.id} className="flex items-center gap-3 bg-primary rounded-xl p-3 border border-card-border">
                    <img
                      loading="lazy"
                      src={item.imageUrl || item.images?.[0] || item.image || ""}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-white"
                      alt={item.name}
                      onError={handleImgError}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate font-tajawal">{item.name}</p>
                      {item.selections && (
                        <div className="flex flex-wrap gap-x-2">
                          {Object.entries(item.selections).map(([key, val]) => (
                            <span key={key} className="text-[10px] text-accent">
                              {key === 'color' ? (isAr ? 'اللون' : 'Color') : key}: {val}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm font-bold text-accent font-mono" dir="ltr">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.cartKey || item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded bg-card flex items-center justify-center hover:bg-accent/10 transition-colors text-text-secondary border border-card-border"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-white font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartKey || item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded bg-card flex items-center justify-center hover:bg-accent/10 transition-colors text-text-secondary border border-card-border"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.cartKey || item.id)}
                        className="w-7 h-7 rounded flex items-center justify-center text-accent-rose hover:bg-accent-rose/10 ms-1 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-card-border px-5 py-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary font-tajawal">{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="font-bold text-white font-mono" dir="ltr">${subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary/70 font-tajawal">{isAr ? "التوصيل" : "Delivery"}</span>
                  <span className="text-text-secondary/70 text-xs font-tajawal">{isAr ? "يُحدد عند الطلب" : "Calculated at checkout"}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-2 font-tajawal"
                >
                  {isAr ? "المتابعة للدفع" : "Proceed to Checkout"}
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
