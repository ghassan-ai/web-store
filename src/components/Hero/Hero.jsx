'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { subscribeToBanners } from "@/firebase/banners";
import { useLang } from "@/context/LanguageContext";
import "./Hero.css";

export default function Hero() {
  const { isAr } = useLang();
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToBanners((data) => {
      setBanners(data.filter(b => b.imageBase64));
    });
    return () => unsubscribe();
  }, []);

  const startAutoRotation = useCallback(() => {
    clearInterval(intervalRef.current);
    if (banners.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
  }, [banners.length]);

  useEffect(() => {
    startAutoRotation();
    return () => clearInterval(intervalRef.current);
  }, [startAutoRotation]);

  const handleBannerClick = () => {
    const banner = banners[currentSlide];
    if (banner?.productId) {
      router.push(`/product/${banner.productId}`);
    }
  };

  const goToPrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    startAutoRotation();
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    startAutoRotation();
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setCurrentSlide(index);
    startAutoRotation();
  };

  if (banners.length === 0) {
    return (
      <section className="hero-section hero-section--empty">
        <div className="text-center px-4 relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight font-tajawal">
            {isAr ? "أحدث الهواتف، توصيل لكل لبنان" : "Latest Phones, Delivered Across Lebanon"}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mt-4 leading-relaxed">
            {isAr
              ? "أجهزة مميزة بأسعار تنافسية. توصيل مجاني لجميع أنحاء لبنان."
              : "Premium devices at competitive prices. Free delivery across Lebanon."}
          </p>
          <button
            onClick={() => router.push("/products")}
            className="inline-flex items-center gap-2.5 bg-accent text-white font-bold px-8 py-4 rounded-full hover:bg-accent-hover hover:scale-[1.02] transition-all duration-300 font-tajawal mt-8"
          >
            <ShoppingBag size={20} />
            {isAr ? "تسوّق الآن" : "Shop Now"}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </button>

          {/* Spec badges */}
          <div className="hero-spec-badge hero-spec-badge--1" dir="ltr">256GB</div>
          <div className="hero-spec-badge hero-spec-badge--2" dir="ltr">Triple Camera</div>
          <div className="hero-spec-badge hero-spec-badge--3" dir="ltr">5G Ready</div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section" aria-label="Banner Slideshow">
      {/* Spec badges floating around the banner */}
      <div className="hero-spec-badge hero-spec-badge--1" dir="ltr">256GB</div>
      <div className="hero-spec-badge hero-spec-badge--2" dir="ltr">Triple Camera</div>
      <div className="hero-spec-badge hero-spec-badge--3" dir="ltr">5G Ready</div>

      <div
        className="hero-banner"
        onClick={handleBannerClick}
        role="link"
        tabIndex={0}
        aria-label={banners[currentSlide]?.productName || "View product"}
        onKeyDown={(e) => { if (e.key === 'Enter') handleBannerClick(); }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`hero-slide ${index === currentSlide ? "hero-slide--active" : ""}`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={banner.imageBase64}
              alt=""
              className="hero-slide__bg"
              aria-hidden="true"
            />
            <img
              src={banner.imageBase64}
              alt={banner.productName || `Slide ${index + 1}`}
              className="hero-slide__img"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {banners.length > 1 && (
          <>
            <button
              className="hero-arrow hero-arrow--prev"
              onClick={goToPrev}
              aria-label={isAr ? "الشريحة السابقة" : "Previous slide"}
            >
              {isAr ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button
              className="hero-arrow hero-arrow--next"
              onClick={goToNext}
              aria-label={isAr ? "الشريحة التالية" : "Next slide"}
            >
              {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </>
        )}
      </div>

      {banners.length > 1 && (
        <div className="hero-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleDotClick(e, index)}
              className={`hero-dot ${index === currentSlide ? "hero-dot--active" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
