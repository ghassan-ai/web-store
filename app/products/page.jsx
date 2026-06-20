'use client';
import { useState, useMemo, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { subscribeToProducts, PRODUCT_CATEGORIES } from "@/supabase/products";
import { useLang } from "@/context/LanguageContext";
import ProductCard from "@/components/ProductCard/ProductCard";

const SORT_OPTIONS_AR = [
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
];

const SORT_OPTIONS_EN = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || null;
  const { isAr } = useLang();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchTimerRef = useRef(null);
  const filterPanelRef = useRef(null);
  const filterBtnRef = useRef(null);

  useEffect(() => {
    const cat = searchParams.get("category") || null;
    setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;
    const handleClickOutside = (e) => {
      if (
        filterPanelRef.current && !filterPanelRef.current.contains(e.target) &&
        filterBtnRef.current && !filterBtnRef.current.contains(e.target)
      ) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filtersOpen]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const filteredAndSorted = useMemo(() => {
    let list = [...products];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(q) || p.nameAr?.includes(q));
    }
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (priceMin !== "") {
      list = list.filter((p) => p.price >= Number(priceMin));
    }
    if (priceMax !== "") {
      list = list.filter((p) => p.price <= Number(priceMax));
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return list;
  }, [products, debouncedSearch, selectedCategory, priceMin, priceMax, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (priceMin !== "" || priceMax !== "") count++;
    return count;
  }, [selectedCategory, priceMin, priceMax]);

  const SORT_OPTIONS = isAr ? SORT_OPTIONS_AR : SORT_OPTIONS_EN;

  const categories = useMemo(() => {
    return PRODUCT_CATEGORIES.filter(c => c.value !== 'other');
  }, []);

  const categoryLabel = useMemo(() => {
    if (!selectedCategory) return null;
    const cat = PRODUCT_CATEGORIES.find(c => c.value === selectedCategory);
    return cat ? (isAr ? cat.labelAr : cat.label) : selectedCategory;
  }, [selectedCategory, isAr]);

  return (
    <div className="bg-primary min-h-screen" dir="rtl">
      {/* Page Header */}
      <div className="bg-primary border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          {selectedCategory && (
            <nav className="text-sm text-text-secondary mb-3 font-tajawal">
              <Link href="/" className="hover:text-accent transition-colors">{isAr ? "الرئيسية" : "Home"}</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-white">{categoryLabel}</span>
            </nav>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-tajawal">
            {isAr ? "المتجر" : "Shop"}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mt-2 font-tajawal">
            {isAr ? "تصفح مجموعتنا المميزة واختر ما يناسبك" : "Browse our collection and find what suits you"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-card border border-card-border rounded-lg h-10 px-4 pe-9 text-sm font-medium text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          </div>

          {/* Filter Button */}
          <button
            ref={filterBtnRef}
            className={`relative flex items-center gap-2 px-4 h-10 bg-card border border-card-border rounded-lg text-sm font-medium text-text-secondary transition-colors ${filtersOpen ? "border-accent text-accent" : ""}`}
            onClick={() => setFiltersOpen(prev => !prev)}
          >
            <SlidersHorizontal size={16} />
            <span>{isAr ? "فلاتر" : "Filters"}</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder={isAr ? "ابحث عن منتج..." : "Search products..."}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-card border border-card-border rounded-lg h-10 pr-9 pl-4 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Filter Panel */}
        {filtersOpen && (
          <div
            ref={filterPanelRef}
            className="bg-card rounded-2xl shadow-lg border border-card-border p-5 sm:p-6 mb-5"
          >
            {/* Category Pills */}
            <div className="mb-5">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? "bg-accent text-white"
                      : "bg-primary text-text-secondary hover:bg-primary/80"
                  }`}
                >
                  الكل
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.value
                        ? "bg-accent text-white"
                        : "bg-primary text-text-secondary hover:bg-primary/80"
                    }`}
                  >
                    {isAr ? cat.labelAr : cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="من $"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  min={0}
                  className="w-full bg-primary border border-card-border rounded-lg py-2.5 px-4 text-sm text-text-secondary placeholder-text-secondary/50 focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="إلى $"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  min={0}
                  className="w-full bg-primary border border-card-border rounded-lg py-2.5 px-4 text-sm text-text-secondary placeholder-text-secondary/50 focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-secondary">
            {isAr
              ? `${filteredAndSorted.length} منتج`
              : `${filteredAndSorted.length} product${filteredAndSorted.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse bg-card border border-card-border">
                <div className="aspect-square bg-gray-100 rounded-t-2xl" />
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="h-4 bg-primary rounded w-2/3" />
                  <div className="h-5 bg-primary rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center mx-auto mb-5 border border-card-border">
              <Search size={32} className="text-text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-tajawal">
              {isAr ? "لا توجد نتائج لبحثك" : "No results found"}
            </h3>
            <p className="text-text-secondary text-sm font-tajawal">
              {isAr ? "جرب كلمة مختلفة" : "Try a different search term"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredAndSorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
