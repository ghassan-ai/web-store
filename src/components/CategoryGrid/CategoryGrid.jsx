'use client';
import Link from "next/link";
import { Smartphone, Headphones, Battery, Watch, Tablet, Cpu, Shield, Cable } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const CATEGORIES = [
  {
    key: "case",
    label: "Cases",
    labelAr: "كفرات",
    icon: Shield,
  },
  {
    key: "accessory",
    label: "Accessories",
    labelAr: "إكسسوارات",
    icon: Watch,
  },
  {
    key: "speaker",
    label: "Speakers",
    labelAr: "سماعات",
    icon: Headphones,
  },
  {
    key: "power-bank",
    label: "Essential Power",
    labelAr: "باور بانك",
    icon: Battery,
  },
  {
    key: "apple-accessory",
    label: "Apple Accessories",
    labelAr: "إكسسوارات أبل",
    icon: Cable,
  },
  {
    key: "electronics",
    label: "Electronics",
    labelAr: "إلكترونيات",
    icon: Cpu,
  },
  {
    key: "tablet",
    label: "Tablets",
    labelAr: "تابلت",
    icon: Tablet,
  },
  {
    key: "phone",
    label: "Phones",
    labelAr: "هواتف",
    icon: Smartphone,
  },
];

export default function CategoryGrid() {
  const { isAr } = useLang();

  return (
    <section className="py-14 sm:py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-tajawal">
            {isAr ? "تسوق حسب الفئة" : "Browse by Category"}
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-3 max-w-md mx-auto">
            {isAr ? "اختر الفئة التي تبحث عنها" : "Find exactly what you're looking for"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.key}
                href={`/products?category=${cat.key}`}
                className="group flex flex-col items-center justify-center gap-3 p-6 sm:p-8 rounded-2xl bg-card border border-card-border hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Icon size={32} className="text-accent group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <span className="text-sm sm:text-base font-bold text-white font-tajawal">
                  {isAr ? cat.labelAr : cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
