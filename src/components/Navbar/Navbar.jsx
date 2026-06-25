'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShoppingCart, Search,
  Menu, X, Home, ShoppingBag, HelpCircle, MapPin, Phone,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";
import "./Navbar.css";

gsap.registerPlugin(ScrollTrigger);

const NAV_ICONS = {
  "/": Home,
  "/products": ShoppingBag,
  "/quiz": HelpCircle,
  "/track-order": MapPin,
  "/#contact": Phone,
};

function Navbar({ cartCount = 0, onCartClick }) {
  const { lang, toggleLang, isAr } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navHidden, setNavHidden] = useState(false);
  const searchInputRef = useRef(null);
  const lastScrollY = useRef(0);
  const navRef = useRef(null);
  const desktopLinksRef = useRef(null);
  const underlineRef = useRef(null);
  const activeBottomRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Scroll-triggered shadow via GSAP ScrollTrigger (Task 1a)
  useGSAP(() => {
    ScrollTrigger.create({
      start: "top -20",
      end: 99999,
      toggleClass: { className: "navbar--scrolled", targets: navRef.current },
    });
  }, { scope: navRef });

  // Hide/show on scroll direction (keep existing behavior)
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Desktop underline position (Task 1b)
  const updateUnderline = useCallback(() => {
    if (!desktopLinksRef.current || !underlineRef.current) return;
    const container = desktopLinksRef.current;
    const activeLink = container.querySelector(`a[data-path="${pathname}"]:not([data-hash])`);
    if (!activeLink) {
      if (underlineRef.current.dataset.initialized) {
        gsap.to(underlineRef.current, { opacity: 0, duration: 0.2 });
      }
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const targetLeft = linkRect.left - containerRect.left;
    const targetWidth = linkRect.width;

    if (targetWidth === 0) return;

    if (underlineRef.current.dataset.initialized) {
      gsap.to(underlineRef.current, {
        left: targetLeft,
        width: targetWidth,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.set(underlineRef.current, { left: targetLeft, width: targetWidth });
      gsap.fromTo(underlineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      underlineRef.current.dataset.initialized = "true";
    }
  }, [pathname, lang]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => updateUnderline());
    });
    const handleResize = () => updateUnderline();
    let timer;
    const debouncedResize = () => {
      clearTimeout(timer);
      timer = setTimeout(handleResize, 150);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timer);
    };
  }, [updateUnderline]);

  // Mobile bottom nav: active icon pop (Task 3)
  useGSAP(() => {
    if (!activeBottomRef.current) return;
    gsap.fromTo(
      activeBottomRef.current,
      { scale: 1 },
      { scale: 1.15, duration: 0.25, ease: "back.out(2)", yoyo: true, repeat: 1, repeatDelay: 0 }
    );
  }, { dependencies: [pathname] });

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav ref={navRef} className={`navbar dark-context ${navHidden ? "navbar--hidden" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[64px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setMobileOpen(false)}>
              <div className="nav-logo-orbit" aria-hidden="true">
                <svg viewBox="0 0 36 36" width="36" height="36">
                  <circle cx="18" cy="18" r="12" fill="none" stroke="rgba(61,139,255,0.3)" strokeWidth="0.8" />
                  <circle cx="18" cy="18" r="8" fill="none" stroke="rgba(61,139,255,0.5)" strokeWidth="0.8" />
                  <circle cx="18" cy="18" r="4" fill="none" stroke="rgba(61,139,255,0.7)" strokeWidth="0.8" />
                  <circle className="orbit-dot orbit-dot--1" cx="30" cy="18" r="2" fill="#3D8BFF" />
                  <circle className="orbit-dot orbit-dot--2" cx="18" cy="10" r="1.5" fill="#3D8BFF" />
                  <circle className="orbit-dot orbit-dot--3" cx="10" cy="22" r="1.2" fill="#3D8BFF" />
                </svg>
              </div>
              <span className="nav-logo-text shimmer-text hidden sm:inline-block">
                {siteConfig.storeName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div ref={desktopLinksRef} className="hidden lg:flex items-center gap-1 relative">
              {siteConfig.navLinks.map((link) => {
                const linkPath = link.path.split("#")[0] || "/";
                const isHash = link.path.includes("#");
                return !isHash ? (
                  <Link
                    key={link.path}
                    href={link.path}
                    data-path={linkPath}
                    className="nav-link"
                  >
                    {isAr ? link.label : link.labelEn}
                  </Link>
                ) : (
                  <a
                    key={link.path}
                    href={link.path}
                    data-path={linkPath}
                    data-hash=""
                    className="nav-link"
                  >
                    {isAr ? link.label : link.labelEn}
                  </a>
                );
              })}
              {/* Animated underline */}
              <span
                ref={underlineRef}
                className="nav-underline"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5">

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="nav-action"
                aria-label={isAr ? "بحث" : "Search"}
              >
                <Search size={20} />
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="nav-lang"
              >
                {lang === "ar" ? "EN" : "AR"}
              </button>

              {/* Cart */}
              <button
                onClick={onCartClick}
                className="nav-action relative"
                aria-label={isAr ? "سلة المشتريات" : "Cart"}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="cart-badge">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="nav-action lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="nav-search-bar">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن منتج..." : "Search products..."}
                className="nav-search-input"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors">
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className={`mobile-bottom-nav ${navHidden ? "mobile-bottom-nav--hidden" : ""}`}>
        {siteConfig.navLinks.map((link) => {
          const Icon = NAV_ICONS[link.path] || Home;
          const isActive = pathname === link.path;
          const item = (
            <>
              <span
                className="bottom-nav-icon"
                ref={isActive ? activeBottomRef : null}
              >
                <Icon size={20} />
              </span>
              <span>{isAr ? link.label : link.labelEn}</span>
            </>
          );

          return link.path.startsWith("/") && !link.path.includes("#") ? (
            <Link
              key={link.path}
              href={link.path}
              className={`bottom-nav-item ${isActive ? "bottom-nav-item--active" : ""}`}
            >
              {item}
            </Link>
          ) : (
            <a
              key={link.path}
              href={link.path}
              className="bottom-nav-item"
            >
              {item}
            </a>
          );
        })}
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="mobile-overlay lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`mobile-drawer lg:hidden ${mobileOpen ? "mobile-drawer--open" : ""}`}
      >
        <div className="flex flex-col h-full">
          <div className="drawer-header">
            <span className="drawer-title">{isAr ? "القائمة" : "Menu"}</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="drawer-close"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {siteConfig.navLinks.map((link) => (
                <li key={link.path}>
                  {link.path.startsWith("/") && !link.path.includes("#") ? (
                    <Link
                      href={link.path}
                      onClick={() => setMobileOpen(false)}
                      className="drawer-link"
                    >
                      {isAr ? link.label : link.labelEn}
                    </Link>
                  ) : (
                    <a
                      href={link.path}
                      onClick={() => setMobileOpen(false)}
                      className="drawer-link"
                    >
                      {isAr ? link.label : link.labelEn}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
