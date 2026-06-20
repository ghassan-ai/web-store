'use client';
import { useMemo } from "react";
import { useLang } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";

export default function Stats({ products = [] }) {
  const { isAr } = useLang();
  const productCount = products.length;
  const categoryCount = useMemo(
    () => new Set(products.map((p) => p.category).filter(Boolean)).size,
    [products]
  );

  const stats = [
    { value: `${productCount}+`, label: isAr ? "منتج" : "Products" },
    { value: siteConfig.stats.customers, label: isAr ? "عميل سعيد" : "Happy Customers" },
    { value: `${categoryCount}+`, label: isAr ? "فئات" : "Categories" },
    { value: siteConfig.stats.supportLabel, label: isAr ? "دعم فني" : "Support" },
  ];

  return (
    <section className="py-12 sm:py-14 bg-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center divide-x divide-card-border rtl:divide-x-reverse">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center px-6 sm:px-10 py-2">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono" dir="ltr">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-text-secondary mt-1 font-tajawal">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
