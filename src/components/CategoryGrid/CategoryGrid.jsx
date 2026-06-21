'use client';
import { useRef, useCallback } from "react";
import Link from "next/link";
import { Smartphone, Headphones, Battery, Watch, Tablet, Cpu, Shield, Cable } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/context/LanguageContext";
import "./CategoryGrid.css";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { key: "case", label: "Cases", labelAr: "كفرات", icon: Shield },
  { key: "accessory", label: "Accessories", labelAr: "إكسسوارات", icon: Watch },
  { key: "speaker", label: "Speakers", labelAr: "سماعات", icon: Headphones },
  { key: "power-bank", label: "Essential Power", labelAr: "باور بانك", icon: Battery },
  { key: "apple-accessory", label: "Apple Accessories", labelAr: "إكسسوارات أبل", icon: Cable },
  { key: "electronics", label: "Electronics", labelAr: "إلكترونيات", icon: Cpu },
  { key: "tablet", label: "Tablets", labelAr: "تابلت", icon: Tablet },
  { key: "phone", label: "Phones", labelAr: "هواتف", icon: Smartphone },
];

function CategoryCard({ cat, isAr }) {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const glowTween = useRef(null);

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    if (!card || !icon) return;

    glowTween.current = gsap.to(card, {
      boxShadow: "0 0 18px rgba(61, 139, 255, 0.45), inset 0 0 0 1.5px rgba(61, 139, 255, 0.5)",
      duration: 0.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.to(icon, {
      scale: 1.15,
      rotation: 6,
      duration: 0.35,
      ease: "back.out(2)",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    if (!card || !icon) return;

    if (glowTween.current) {
      glowTween.current.kill();
      glowTween.current = null;
    }

    gsap.to(card, {
      boxShadow: "0 0 0px rgba(61, 139, 255, 0), inset 0 0 0 0px rgba(61, 139, 255, 0)",
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(icon, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const Icon = cat.icon;

  return (
    <Link
      ref={cardRef}
      href={`/products?category=${cat.key}`}
      className="category-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="category-icon-container">
        <span ref={iconRef} className="category-icon-inner">
          <Icon size={30} strokeWidth={2} stroke="url(#category-icon-gradient)" />
        </span>
      </div>
      <span className="category-card-title font-tajawal">
        {isAr ? cat.labelAr : cat.label}
      </span>
    </Link>
  );
}

export default function CategoryGrid() {
  const { isAr } = useLang();
  const sectionRef = useRef(null);

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const cards = gsap.utils.toArray(".category-card");
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

  return (
    <section ref={sectionRef} className="py-14 sm:py-20">
      {/* Shared gradient definition for all category icons */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <linearGradient id="category-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3D8BFF" />
            <stop offset="100%" stopColor="#EAF2FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-dark-heading tracking-tight font-tajawal">
            {isAr ? "تسوق حسب الفئة" : "Browse by Category"}
          </h2>
          <p className="text-text-dark-muted text-sm sm:text-base mt-3 max-w-md mx-auto">
            {isAr ? "اختر الفئة التي تبحث عنها" : "Find exactly what you're looking for"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.key} cat={cat} isAr={isAr} />
          ))}
        </div>
      </div>
    </section>
  );
}
