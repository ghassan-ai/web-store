'use client';
import Link from "next/link";
import { Phone, MapPin, Instagram, Facebook, Mail } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";

export default function Footer() {
  const { isAr } = useLang();

  return (
    <footer id="contact" className="bg-primary-dark text-text-secondary border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Store Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">PH</span>
              </div>
              <span className="text-lg font-bold text-white font-tajawal">{siteConfig.storeName}</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xs font-tajawal">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3">
              {siteConfig.contact.instagram && (
                <a href={siteConfig.contact.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-card hover:bg-accent/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 group border border-card-border" aria-label="Instagram">
                  <Instagram size={18} className="text-text-secondary group-hover:text-accent" />
                </a>
              )}
              {siteConfig.contact.facebook && (
                <a href={siteConfig.contact.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-card hover:bg-accent/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 group border border-card-border" aria-label="Facebook">
                  <Facebook size={18} className="text-text-secondary group-hover:text-accent" />
                </a>
              )}
              {siteConfig.contact.email && (
                <a href={`mailto:${siteConfig.contact.email}`} className="w-10 h-10 rounded-xl bg-card hover:bg-accent/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 group border border-card-border" aria-label="Email">
                  <Mail size={18} className="text-text-secondary group-hover:text-accent" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-5 font-tajawal">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-3">
              {siteConfig.navLinks
                .filter((link) => link.path !== "/quiz" && link.path !== "/#contact")
                .map((link) => (
                <li key={link.path}>
                  {link.path.startsWith("/") && !link.path.includes("#") ? (
                    <Link href={link.path} className="text-text-secondary hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-200 text-sm inline-block font-tajawal">
                      {isAr ? link.label : link.labelEn}
                    </Link>
                  ) : (
                    <a href={link.path} className="text-text-secondary hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-200 text-sm inline-block font-tajawal">
                      {isAr ? link.label : link.labelEn}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-5 font-tajawal">
              {isAr ? "الفئات" : "Categories"}
            </h3>
            <ul className="space-y-3">
              {siteConfig.categories.map((cat) => (
                <li key={cat.label}>
                  <Link href={cat.path} className="text-text-secondary hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-200 text-sm inline-block font-tajawal">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-5 font-tajawal">
              {isAr ? "تواصل معنا" : "Contact"}
            </h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors duration-200 text-sm">
                  <Phone size={16} className="flex-shrink-0 text-accent/60" />
                  <span dir="ltr" className="font-mono">{siteConfig.contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.contact.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors duration-200 text-sm">
                  <Instagram size={16} className="flex-shrink-0 text-accent/60" />
                  @lebphonestore
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <MapPin size={16} className="flex-shrink-0 text-accent/60" />
                  {siteConfig.contact.address}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-secondary">
          <span>© {siteConfig.copyright.year} {siteConfig.storeName}. {isAr ? "جميع الحقوق محفوظة" : "All rights reserved"}.</span>
          <span>{siteConfig.copyright.madeIn}</span>
        </div>
      </div>
    </footer>
  );
}
