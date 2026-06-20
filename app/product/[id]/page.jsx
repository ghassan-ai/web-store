'use client';
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { subscribeToProducts } from "@/supabase/products";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";
import { handleImgError } from "@/utils/imageHelpers";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAr } = useLang();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts((data) => {
      setAllProducts(data);
      const found = data.find((p) => p.id === id);
      setProduct(found || null);
      setQuantity(1);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 6);
  }, [product, allProducts]);

  const handleAddToCart = () => {
    if (!product) return;
    const selections = {};
    if (selectedColor) selections.color = selectedColor;
    if (product.customOptions?.length > 0) {
      product.customOptions.forEach((group) => {
        if (selectedOptions[group.id]) {
          selections[group.title] = selectedOptions[group.id];
        }
      });
    }
    const hasSelections = Object.keys(selections).length > 0;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, hasSelections ? selections : null);
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    let optionsText = '';
    if (selectedColor) optionsText += `\nاللون: ${selectedColor}`;
    if (product.customOptions?.length > 0) {
      product.customOptions.forEach((group) => {
        if (selectedOptions[group.id]) {
          optionsText += `\n${group.title}: ${selectedOptions[group.id]}`;
        }
      });
    }
    const text = `مرحباً، أريد طلب هذا المنتج:\n\nالمنتج: ${product.name}${optionsText}\nالكمية: ${quantity}\nالسعر: $${product.price}`;

    window.open(
      `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold text-white mb-2 font-tajawal">
          {isAr ? "المنتج غير موجود" : "Product not found"}
        </h2>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 px-6 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors font-tajawal"
        >
          {isAr ? "العودة للمتجر" : "Back to Shop"}
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-secondary mb-4 font-tajawal">
          <Link href="/" className="hover:text-accent transition-colors">{isAr ? "الرئيسية" : "Home"}</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/products" className="hover:text-accent transition-colors">{isAr ? "المتجر" : "Shop"}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="aspect-square bg-white overflow-hidden cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <img
                src={product.imageUrl || ""}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={handleImgError}
              />
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 flex flex-col" dir="rtl">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 font-tajawal">
                {product.name}
              </h1>

              <div className="text-2xl sm:text-3xl font-bold text-accent mb-4 font-mono" dir="ltr">
                ${product.price}
              </div>

              {product.specs && (
                <div className="mb-4 text-sm text-text-secondary whitespace-pre-line border-t border-card-border pt-3 font-tajawal">
                  {product.specs}
                </div>
              )}

              {product.colors?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-text-secondary font-tajawal">اللون:</p>
                    {selectedColor && (
                      <span className="text-xs text-text-secondary/70">{selectedColor}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {product.colors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-all ${
                          selectedColor === color
                            ? 'ring-2 ring-offset-2 ring-accent ring-offset-card scale-110'
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color, border: '2px solid #2A3A6B' }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.customOptions?.length > 0 && product.customOptions.map((group) => (
                <div key={group.id} className="mb-4">
                  <p className="text-sm font-semibold text-text-secondary font-tajawal mb-2">{group.title}:</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {group.values.map((val, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [group.id]: val }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          selectedOptions[group.id] === val
                            ? 'bg-accent text-white border-accent ring-2 ring-offset-2 ring-accent ring-offset-card scale-105'
                            : 'bg-card border-card-border text-text-secondary hover:border-accent hover:text-white hover:scale-105'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mb-4">
                <span className={`text-sm font-medium ${isOutOfStock ? "text-accent-rose" : "text-accent-emerald"}`}>
                  {isOutOfStock ? "غير متوفر" : `${product.stock} متوفر`}
                </span>
              </div>

              {/* Quantity */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-text-secondary mb-2 font-tajawal">الكمية:</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-lg border border-card-border flex items-center justify-center text-white hover:bg-primary transition font-bold"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold text-white w-8 text-center font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                      className="w-9 h-9 rounded-lg border border-card-border flex items-center justify-center text-white hover:bg-primary transition font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-colors disabled:bg-card-border disabled:text-text-secondary disabled:cursor-not-allowed flex items-center justify-center gap-2 font-tajawal"
                >
                  <ShoppingCart size={18} />
                  {isAr ? "أضف للسلة" : "Add to Cart"}
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 py-3.5 bg-accent-emerald text-white font-bold rounded-xl hover:brightness-110 transition-colors flex items-center justify-center gap-2 font-tajawal"
                >
                  <MessageCircle size={18} />
                  {isAr ? "اطلب عبر واتساب" : "Order via WhatsApp"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 font-tajawal" dir="rtl">
              {isAr ? "منتجات مشابهة" : "Similar Products"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {similarProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group rounded-xl overflow-hidden bg-card border border-card-border hover:border-accent/40 transition-all duration-300"
                >
                  <div className="aspect-square bg-white overflow-hidden">
                    <img
                      loading="lazy"
                      src={p.imageUrl || ""}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImgError}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 mb-1 font-tajawal">{p.name}</h3>
                    <span className="text-sm font-bold text-accent font-mono" dir="ltr">${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-bold z-10"
          >
            &times;
          </button>
          <img
            src={product.imageUrl || ""}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
