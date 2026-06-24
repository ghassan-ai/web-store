'use client';
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/context/LanguageContext";
import ProductCard from "@/components/ProductCard/ProductCard";

gsap.registerPlugin(ScrollTrigger);

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse bg-surface-card border border-surface-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="product-image-box !bg-slate-50 border-b border-surface-border" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-5 bg-slate-100 rounded w-1/3" />
        <div className="h-8 bg-slate-100 rounded-full w-full" />
      </div>
    </div>
  );
}

export default function NewArrivals({ products = [], loading = false }) {
  const { isAr } = useLang();
  const sectionRef = useRef(null);

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const cards = gsap.utils.toArray(sectionRef.current.querySelectorAll('.arrival-card-wrapper'));
    gsap.set(cards, { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power3.out",
        });
      },
    });
  }, { scope: sectionRef });

  const latestProducts = React.useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [products]);

  return (
    <section ref={sectionRef} className="py-14 sm:py-20">
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
                <div key={product.id} className="arrival-card-wrapper">
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
