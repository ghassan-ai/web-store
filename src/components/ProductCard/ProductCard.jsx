'use client';
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";

const ProductCard = React.memo(function ProductCard({ product, viewMode = "grid" }) {
  const { addToCart } = useCart();
  const { isAr } = useLang();
  const router = useRouter();

  const [imgSrc, setImgSrc] = useState(product.imageUrl || "/placeholder.svg");
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
          <Image src={imgSrc} alt={product.name} fill className="object-contain p-1.5" sizes="80px" onError={() => setImgSrc("/placeholder.svg")} />
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
      <div className="product-image-box border-b border-surface-border relative">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-contain !max-w-[80%] !max-h-[80%] !inset-0 !m-auto"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImgSrc("/placeholder.svg")}
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
