'use client';
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";
import { handleImgError } from "@/utils/imageHelpers";

const ProductCard = React.memo(function ProductCard({ product, viewMode = "grid" }) {
  const { addToCart } = useCart();
  const { isAr } = useLang();
  const router = useRouter();

  const imageUrl = product.imageUrl || "";
  const isOutOfStock = product.stock === 0;

  const handleCall = useCallback(() => {
    const phone = siteConfig.contact?.phone?.replace(/\s/g, "") || "+96171094407";
    window.open(`tel:${phone}`, "_self");
  }, []);

  if (viewMode === "list") {
    return (
      <div
        onClick={() => router.push(`/product/${product.id}`)}
        className="flex items-center gap-4 bg-surface-card rounded-xl p-3 border border-surface-border shadow-sm hover:border-accent/40 transition-all cursor-pointer"
      >
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50">
          <img loading="lazy" src={imageUrl} alt={product.name} className="w-full h-full object-cover" onError={handleImgError} />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">SOLD</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-dark-heading truncate font-tajawal">{product.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-lg font-bold text-accent font-mono" dir="ltr">${product.price}</span>
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              disabled={isOutOfStock}
              className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-all disabled:bg-slate-100 disabled:text-text-dark-muted disabled:cursor-not-allowed"
            >
              <ShoppingCart size={14} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleCall(); }} className="w-8 h-8 rounded-lg bg-accent-emerald text-white flex items-center justify-center hover:brightness-110 transition-all">
              <Phone size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="group rounded-2xl overflow-hidden bg-surface-card border border-surface-border shadow-sm hover:border-accent/40 hover:-translate-y-1 transition-all duration-400 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          loading="lazy"
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={handleImgError}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-accent-rose text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg">
              {isAr ? "نفذت الكمية" : "Sold Out"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-text-dark-heading line-clamp-2 mb-2.5 min-h-[2.5rem] font-tajawal">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-accent font-mono" dir="ltr">${product.price}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              disabled={isOutOfStock}
              className="h-9 px-3.5 rounded-xl bg-accent text-white text-xs font-medium flex items-center gap-1.5 hover:bg-accent-hover transition-all duration-200 disabled:bg-slate-100 disabled:text-text-dark-muted disabled:cursor-not-allowed"
            >
              <ShoppingCart size={14} />
              <span className="hidden sm:inline">{isAr ? "أضف" : "Add"}</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleCall(); }} className="h-9 w-9 rounded-xl bg-accent-emerald text-white flex items-center justify-center hover:brightness-110 transition-all duration-200">
              <Phone size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
