'use client';
import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { handleImgError } from "@/utils/imageHelpers";

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse bg-surface-card border border-surface-border">
      <div className="aspect-square bg-slate-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-100 rounded w-2/3" />
        <div className="h-5 bg-slate-100 rounded w-1/4" />
      </div>
    </div>
  );
}

const ArrivalCard = React.memo(function ArrivalCard({ product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/product/${product.id}`} className="group rounded-2xl overflow-hidden bg-surface-card border border-surface-border shadow-sm hover:border-accent/40 hover:-translate-y-1 transition-all duration-400">
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          loading="lazy"
          src={product.imageUrl || ""}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={handleImgError}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-accent-rose text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">نفذت الكمية</span>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-text-dark-heading line-clamp-2 mb-3 font-tajawal">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-accent font-mono" dir="ltr">${product.price}</span>
        </div>
      </div>
    </Link>
  );
});

export default function NewArrivals({ products = [], loading = false }) {
  const { isAr } = useLang();

  const latestProducts = React.useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [products]);

  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-dark-heading tracking-tight font-tajawal">
              {isAr ? "وصل حديثاً" : "New Arrivals"}
            </h2>
            <p className="text-text-dark-muted text-sm sm:text-base mt-2">
              {isAr ? "أحدث المنتجات في متجرنا" : "Latest products in our store"}
            </p>
          </div>
          <Link
            href="/products?status=new"
            className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover text-sm font-semibold hover:gap-2.5 transition-all duration-300"
          >
            {isAr ? "عرض الكل" : "View All"}
            {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : latestProducts.map((product) => (
                <ArrivalCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
