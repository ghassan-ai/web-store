'use client';
import { useMemo, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, MapPin } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLang } from "@/context/LanguageContext";
import GridScan from "@/components/GridScan";
import RotatingText from "@/components/RotatingText";
import "./Hero.css";

function HeroHeadline({ line1, line2, rotatingTexts }) {
  const containerRef = useRef(null);
  const line2Ref = useRef(null);
  const line1Words = line1.split(" ");

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
            <span className="hero-word" style={{ display: "inline-block" }}>
              {word}{i < line1Words.length - 1 ? ' ' : ''}
            </span>
          </span>
        ))}
      </span>
      <span ref={line2Ref} className="hero-line hero-line-2">
        {rotatingTexts ? (
          <RotatingText
            texts={rotatingTexts}
            rotationInterval={2800}
            staggerFrom="last"
            staggerDuration={0.025}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            loop={true}
            auto={true}
            mainClassName="hero-rotating-word"
            elementLevelClassName="hero-rotating-char"
          />
        ) : (
          line2.split(" ").map((word, i) => (
            <span key={i} className="word-wrapper" style={{ display: "inline-block", overflow: "hidden" }}>
              <span className="hero-word" style={{ display: "inline-block" }}>
                {word}&nbsp;
              </span>
            </span>
          ))
        )}
      </span>
    </h1>
  );
}

function StatNumber({ value, suffix }) {
  const isNumeric = !isNaN(parseInt(value, 10));

  return (
    <span className="hero-stat__value font-mono stat-item">
      {value}{isNumeric ? (suffix || "") : ""}
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
    tl.from(".hero-word", { y: 6, duration: 0.35, stagger: 0.04, ease: "power2.out" })
      .from(".hero-subtitle", { y: 6, duration: 0.3, ease: "power2.out" }, "-=0.2")
      .from(".hero-ctas", { y: 6, duration: 0.3, ease: "power2.out" }, "-=0.15")
      .from(".stat-item", { y: 4, duration: 0.3, stagger: 0.06, ease: "power2.out" }, "-=0.1");
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="hero-new">
      <div className="hero-grid-bg" aria-hidden="true" />

      <GridScan
        scanColor="#3B82F6"
        linesColor="#162049"
        bloomIntensity={0.4}
        scanOpacity={0.4}
        gridScale={0.1}
        sensitivity={0.55}
      />

      <div className="hero-content">
        {isAr ? (
          <HeroHeadline line1="متجر الهواتف:" line2="وجهتك الأولى" />
        ) : (
          <HeroHeadline
            line1="Phone Store: Your First"
            line2="Destination"
            rotatingTexts={['Destination', 'Choice', 'Priority', 'Stop']}
          />
        )}

        <p className="hero-subtitle font-tajawal">
          {isAr
            ? "أرخص اكسسوارات الهواتف المتوفرة في لبنان - جودة يمكنك الوثوق بها"
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
