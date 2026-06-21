'use client';
import { useState, useEffect } from "react";
import { subscribeToProducts } from "@/supabase/products";
import ProductQuiz from "@/components/ProductQuiz/ProductQuiz";

export default function QuizPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-[60vh]">
      <ProductQuiz products={products} />
    </div>
  );
}
