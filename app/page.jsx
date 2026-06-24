'use client';
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { subscribeToProducts } from "@/supabase/products";
import { useLang } from "@/context/LanguageContext";
import Hero from "@/components/Hero/Hero";
import CategoryGrid from "@/components/CategoryGrid/CategoryGrid";
import NewArrivals from "@/components/NewArrivals/NewArrivals";
import ProductQuiz from "@/components/ProductQuiz/ProductQuiz";

gsap.registerPlugin(ScrollTrigger);

function PromoBanner() {
  const { isAr } = useLang();
  const bannerRef = useRef(null);

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    gsap.set(bannerRef.current, { opacity: 0, y: 24 });

    ScrollTrigger.create({
      trigger: bannerRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(bannerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      },
    });
  }, { scope: bannerRef });

  return (
    <section ref={bannerRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="relative overflow-hidden rounded-2xl p-8 sm:p-12" style={{ background: 'linear-gradient(135deg, #3D8BFF 0%, #0B1430 100%)' }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-30" />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Sparkles size={32} className="text-white/70" />
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">
                {isAr ? "تخفيضات الصيف — حتى 30% خصم" : "Summer Sale — Up to 30% Off"}
              </h3>
              <p className="text-white/70 mt-1 font-tajawal">
                {isAr ? "عروض محدودة على أحدث الهواتف" : "Limited deals on the latest phones"}
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-full hover:scale-[1.02] transition-all duration-300 shadow-lg whitespace-nowrap font-tajawal"
          >
            {isAr ? "تسوق العروض" : "Shop Sale"}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Hero products={products} />
      <CategoryGrid />
      <NewArrivals products={products} loading={loading} />
      <PromoBanner />
      <ProductQuiz products={products} />
    </div>
  );
}
