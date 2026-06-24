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
  const colors = product.colors || [];

  const handleCall = useCallback(() => {
    const phone = siteConfig.contact?.phone?.replace(/\s/g, "") || "+96171094407";
    window.open(`tel:${phone}`, "_self");
  }, []);

  if (viewMode === "list") {
    return (
      <div
        onClick={() => router.push(`/product/${product.id}`)}
        className="flex items-center gap-4 bg-surface-card rounded-xl p-3 border border-surface-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(61,139,255,0.08)] hover:border-accent/30 transition-all duration-300 cursor-pointer"
      >
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-surface-border">
          <img loading="lazy" src={imageUrl} alt={product.name} className="w-full h-full object-contain p-1.5" onError={handleImgError} />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">SOLD</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-dark-heading truncate font-tajawal">{product.name}</h3>
          {colors.length > 0 && (
            <div className="flex gap-1 mt-1.5">
              {colors.slice(0, 4).map((c, i) => (
                <span key={i} className="w-3.5 h-3.5 rounded-full border border-surface-border" style={{ backgroundColor: c }} />
              ))}
              {colors.length > 4 && <span className="text-[10px] text-text-dark-muted self-center">+{colors.length - 4}</span>}
            </div>
          )}
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
      className="group flex flex-col rounded-2xl overflow-hidden bg-surface-card border border-surface-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(61,139,255,0.10)] hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="product-image-box border-b border-surface-border">
        <img
          loading="lazy"
          src={imageUrl}
          alt={product.name}
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

      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <h3 className="text-[13px] sm:text-sm font-bold text-text-dark-heading leading-snug line-clamp-2 min-h-[2.4rem] font-tajawal">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <span className="text-base sm:text-lg font-extrabold text-accent font-mono tracking-tight" dir="ltr">${product.price}</span>
          {colors.length > 0 && (
            <div className="flex gap-1">
              {colors.slice(0, 4).map((c, i) => (
                <span key={i} className="w-3.5 h-3.5 rounded-full border border-surface-border shadow-sm" style={{ backgroundColor: c }} />
              ))}
              {colors.length > 4 && <span className="text-[10px] text-text-dark-muted self-center">+{colors.length - 4}</span>}
            </div>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          disabled={isOutOfStock}
          className="mt-3 w-full py-2 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-accent/20 transition-all duration-200 disabled:bg-slate-100 disabled:text-text-dark-muted disabled:cursor-not-allowed"
        >
          <ShoppingCart size={14} />
          {isAr ? "أضف للسلة" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
});

export default ProductCard;
