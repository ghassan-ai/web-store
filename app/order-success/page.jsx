'use client';
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, Truck, ShoppingBag } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAr } = useLang();
  const [copied, setCopied] = useState(false);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.replace("/");
    }
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div dir="rtl" className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Checkmark Animation */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-accent-emerald/20 animate-ping opacity-30" />
          <div className="relative w-24 h-24 rounded-full bg-accent-emerald flex items-center justify-center shadow-lg shadow-accent-emerald/20">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-text-dark-heading mb-2 font-tajawal">
          {isAr ? "شكراً لطلبك" : "Thank you for your order"}
        </h1>
        <p className="text-text-dark-muted text-sm mb-8 font-tajawal">
          {isAr ? "لا تختفي... ننتظر زيارتك القادمة!" : "Don't disappear... we look forward to your next visit!"}
        </p>

        {/* Order Number Card */}
        <div className="bg-surface-card rounded-2xl border border-surface-border shadow-sm p-6 mb-8">
          <p className="text-xs text-text-dark-muted mb-2 font-medium font-tajawal">
            {isAr ? "رقم الطلب" : "Order Number"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl font-bold text-text-dark-heading tracking-wider font-mono" dir="ltr">
              {orderId}
            </span>
            <button
              onClick={handleCopy}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                copied ? "bg-accent-emerald/20 text-accent-emerald" : "bg-slate-100 text-text-dark-muted hover:bg-accent/10"
              }`}
              title={isAr ? "نسخ" : "Copy"}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          {copied && (
            <p className="text-accent-emerald text-xs mt-2 font-tajawal">{isAr ? "تم النسخ!" : "Copied!"}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/track-order")}
            className="w-full py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 font-tajawal"
          >
            <Truck size={18} />
            {isAr ? "تتبع طلبك" : "Track Your Order"}
          </button>
          <button
            onClick={() => router.push("/products")}
            className="w-full py-3.5 bg-surface-card text-text-dark-heading font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 border border-surface-border font-tajawal"
          >
            <ShoppingBag size={18} />
            {isAr ? "تابع التسوق" : "Continue Shopping"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
