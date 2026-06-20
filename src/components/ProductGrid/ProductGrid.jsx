'use client';
import ProductCard from "@/components/ProductCard/ProductCard";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import "./ProductGrid.css";

function ProductGrid({ products = [], loading }) {
  if (loading) {
    // Skeleton أثناء التحميل
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center text-gray-500 dark:text-secondary-300 mt-10">لا توجد منتجات مطابقة حالياً.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export default ProductGrid;
