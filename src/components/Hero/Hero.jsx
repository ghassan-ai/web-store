'use client';
import { useMemo } from "react";
import Link from "next/link";
import { ShoppingBag, MapPin } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import "./Hero.css";

function ArcDots() {
  return (
    <div className="arc-dots" aria-hidden="true">
      {/* Arc path (subtle circle outline) */}
      <svg className="arc-path" viewBox="0 0 400 400" fill="none">
        <circle cx="320" cy="120" r="80" stroke="rgba(45,212,191,0.08)" strokeWidth="0.5" />
        <circle cx="350" cy="80" r="140" stroke="rgba(45,212,191,0.05)" strokeWidth="0.5" />
      </svg>
      {/* Scattered dots near top-right and header */}
      <div className="arc-dot arc-dot--1" />
      <div className="arc-dot arc-dot--2" />
      <div className="arc-dot arc-dot--3" />
      <div className="arc-dot arc-dot--4" />
      <div className="arc-dot arc-dot--5" />
      <div className="arc-dot arc-dot--6" />
      <div className="arc-dot arc-dot--7" />
      <div className="arc-dot arc-dot--8" />
    </div>
  );
}

export default function Hero({ products = [] }) {
  const { isAr } = useLang();

  const stats = useMemo(() => [
    { value: "500+", label: isAr ? "منتج متوفر" : "Products" },
    { value: "10K+", label: isAr ? "عميل سعيد" : "Happy Customers" },
    { value: "50+", label: isAr ? "علامة تجارية" : "Brands" },
    { value: "24/7", label: isAr ? "خدمات دائمة" : "Always Available" },
  ], [isAr]);

  return (
    <section className="hero-new">
      <div className="hero-grid-bg" aria-hidden="true" />

      <ArcDots />

      <div className="hero-content">
        <h1 className="hero-headline font-tajawal">
          {isAr ? "متجر الهواتف: وجهتك الأولى" : "Phone Store: Your First Destination"}
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle font-tajawal">
          {isAr
            ? "أرخص اكسسوارات الهواتف المتدرة في لبنان - جودة يمكنك الوثوق بها"
            : "The most affordable phone accessories in Lebanon - quality you can trust"}
        </p>

        {/* CTAs */}
        <div className="hero-ctas">
          <Link href="/products" className="hero-btn hero-btn--solid font-tajawal">
            <ShoppingBag size={18} />
            {isAr ? "تسوّق الآن" : "Shop Now"}
          </Link>
          <Link href="/track-order" className="hero-btn hero-btn--outline font-tajawal">
            <MapPin size={18} />
            {isAr ? "تتبع طلبك" : "Track Order"}
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="hero-stats" dir="ltr">
          {stats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <span className="hero-stat__value font-mono">
                {stat.value}
              </span>
              <span className="hero-stat__label font-tajawal">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
