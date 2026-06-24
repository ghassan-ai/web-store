'use client';
import { useMemo, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, MapPin } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLang } from "@/context/LanguageContext";
import ConstellationBackground from "@/components/ConstellationBackground/ConstellationBackground";
import "./Hero.css";

function HeroHeadline({ line1, line2 }) {
  const containerRef = useRef(null);
  const line2Ref = useRef(null);
  const line1Words = line1.split(" ");
  const line2Words = line2.split(" ");

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !line2Ref.current) return;
    gsap.to(line2Ref.current, {
      textShadow: "0 0 20px rgba(61, 139, 255, 0.6), 0 0 40px rgba(61, 139, 255, 0.3)",
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, { scope: containerRef });

  return (
    <h1 ref={containerRef} className="hero-headline font-tajawal">
      <span className="hero-line shimmer-text">
        {line1Words.map((word, i) => (
          <span key={i} className="word-wrapper" style={{ display: "inline-block", overflow: "hidden" }}>
            <span className="word" style={{ display: "inline-block" }}>
              {word}&nbsp;
            </span>
          </span>
        ))}
      </span>
      <span ref={line2Ref} className="hero-line hero-line-2">
        {line2Words.map((word, i) => (
          <span key={i} className="word-wrapper" style={{ display: "inline-block", overflow: "hidden" }}>
            <span className="word" style={{ display: "inline-block" }}>
              {word}&nbsp;
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
}

function StatNumber({ value, suffix }) {
  const ref = useRef(null);
  const target = parseInt(value, 10);
  const isNumeric = !isNaN(target);

  useGSAP(() => {
    if (!isNumeric || !ref.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      ref.current.textContent = target + (suffix || "");
      return;
    }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.2,
      delay: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        ref.current.textContent = Math.floor(obj.val) + (suffix || "");
      },
    });
  }, []);

  if (!isNumeric) {
    return (
      <span className="hero-stat__value font-mono stat-item">
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className="hero-stat__value font-mono stat-item">
      0{suffix || ""}
    </span>
  );
}

export default function Hero({ products = [] }) {
  const { isAr } = useLang();
  const heroRef = useRef(null);

  const stats = useMemo(() => [
    { value: "500", suffix: "+", label: isAr ? "منتج متوفر" : "Products" },
    { value: "10", suffix: "K+", label: isAr ? "عميل سعيد" : "Happy Customers" },
    { value: "50", suffix: "+", label: isAr ? "علامة تجارية" : "Brands" },
    { value: "24/7", label: isAr ? "خدمات دائمة" : "Always Available" },
  ], [isAr]);

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const tl = gsap.timeline();
    tl.from(".word", { y: 24, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" })
      .from(".hero-subtitle", { y: 16, opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
      .from(".hero-ctas", { y: 16, opacity: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
      .from(".stat-item", { opacity: 0, y: 10, duration: 0.4, stagger: 0.12, ease: "power2.out" }, "-=0.1");
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="hero-new">
      <div className="hero-grid-bg" aria-hidden="true" />

      <ConstellationBackground />

      <div className="hero-content">
        {isAr ? (
          <HeroHeadline line1="متجر الهواتف:" line2="وجهتك الأولى" />
        ) : (
          <HeroHeadline line1="Phone Store: Your First" line2="Destination" />
        )}

        <p className="hero-subtitle font-tajawal">
          {isAr
            ? "أرخص اكسسوارات الهواتف المتدرة في لبنان - جودة يمكنك الوثوق بها"
            : "The most affordable phone accessories in Lebanon - quality you can trust"}
        </p>

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

        <div className="hero-stats" dir="ltr">
          {stats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <StatNumber value={stat.value} suffix={stat.suffix} />
              <span className="hero-stat__label font-tajawal stat-item">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
