'use client';
import { useState, useEffect, useRef } from "react";
import { Search, Package, CheckCircle2, Circle, Truck, PackageCheck, Clock } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";
import { subscribeToOrderByNumber } from "@/supabase/orders";

const STATUS_STEPS = [
  { key: "pending", labelAr: "تم استلام الطلب", labelEn: "Order Received", icon: Clock },
  { key: "processing", labelAr: "قيد التجهيز", labelEn: "Processing", icon: Package },
  { key: "shipped", labelAr: "تم الشحن", labelEn: "Shipped", icon: Truck },
  { key: "delivered", labelAr: "تم التسليم", labelEn: "Delivered", icon: PackageCheck },
];

const statusColors = {
  pending: "#f59e0b",
  processing: "#3D8BFF",
  shipped: "#8b5cf6",
  delivered: "#2ECC71",
};

function getStatusIndex(status) {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

export default function TrackOrderPage() {
  const { isAr } = useLang();
  const [orderNumber, setOrderNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const unsubRef = useRef(null);

  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) return;

    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    setSearched(true);
    setLoading(true);
    setOrder(null);

    unsubRef.current = subscribeToOrderByNumber(trimmed, (data) => {
      setOrder(data);
      setLoading(false);
    });
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString(isAr ? "ar-LB" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 border border-surface-border">
            <Package size={32} className="text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-dark-heading mb-2 font-tajawal">
            {isAr ? "تتبع طلبك" : "Track Your Order"}
          </h1>
          <p className="text-text-dark-muted text-sm font-tajawal">
            {isAr ? "أدخل رقم الطلب لمعرفة حالته" : "Enter your order number to check its status"}
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={isAr ? "رقم الطلب (مثال: ORD-1718123456)" : "Order number (e.g. ORD-1718123456)"}
              value={orderNumber}
              onChange={(e) => { setOrderNumber(e.target.value); setSearched(false); setOrder(null); }}
              className="w-full bg-surface-card border border-surface-border focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl py-3.5 px-4 pl-12 text-base outline-none transition-all font-mono"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted" />
          </div>
          <button type="submit" disabled={loading} className="w-full mt-4 bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl transition-colors disabled:bg-slate-100 disabled:text-text-dark-muted font-tajawal">
            {loading ? (isAr ? "جاري البحث..." : "Searching...") : (isAr ? "تتبع" : "Track")}
          </button>
        </form>

        {/* Results */}
        {searched && !loading && (
          <div className="animate-fade-in">
            {order ? (
              <div className="bg-surface-card rounded-2xl p-6 border border-surface-border shadow-sm">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-text-dark-heading font-tajawal">
                      {isAr ? "طلب" : "Order"} <span className="font-mono" dir="ltr">#{order.orderNumber}</span>
                    </h3>
                    <p className="text-sm text-text-dark-muted mt-1 font-tajawal">{order.customerName}</p>
                    {order.createdAt && (
                      <p className="text-xs text-text-dark-muted/70 mt-0.5">{formatDate(order.createdAt)}</p>
                    )}
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold text-white"
                    style={{ background: statusColors[order.status] || "#6b7280" }}
                  >
                    {(() => {
                      const step = STATUS_STEPS.find(s => s.key === order.status);
                      const Icon = step?.icon || Circle;
                      return <Icon size={14} />;
                    })()}
                    {STATUS_STEPS.find(s => s.key === order.status)?.[isAr ? "labelAr" : "labelEn"] || order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-6">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-dark-body font-tajawal">{item.name}</span>
                        <span className="text-xs text-text-dark-muted">×{item.quantity}</span>
                      </div>
                      <span className="text-sm font-bold text-text-dark-heading font-mono" dir="ltr">${item.price}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-surface-border">
                    <span className="font-bold text-text-dark-muted font-tajawal">{isAr ? "المجموع" : "Total"}</span>
                    <span className="font-bold text-lg text-accent font-mono" dir="ltr">${order.total}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getStatusIndex(order.status);
                    const isDone = idx <= currentIdx;
                    const isLast = idx === STATUS_STEPS.length - 1;
                    const Icon = step.icon;
                    const color = isDone ? statusColors[step.key] : "#E2E8F0";

                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: isDone ? color : "transparent", border: isDone ? "none" : "2px dashed #E2E8F0" }}
                          >
                            {isDone ? <CheckCircle2 size={18} className="text-white" /> : <Icon size={16} style={{ color: "#5C6B8A" }} />}
                          </div>
                          {!isLast && <div className="w-0.5 h-10" style={{ background: isDone ? color : "#E2E8F0" }} />}
                        </div>
                        <div className="pt-1.5 pb-5">
                          <p className={`text-sm font-semibold ${isDone ? "text-text-dark-heading" : "text-text-dark-muted"} font-tajawal`}>
                            {isAr ? step.labelAr : step.labelEn}
                          </p>
                          <p className={`text-xs mt-0.5 ${isDone ? "text-text-dark-muted" : "text-text-dark-muted/50"}`}>
                            {isDone ? (isAr ? "تم" : "Done") : (isAr ? "في انتظار التحديث" : "Pending")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-surface-card rounded-2xl p-6 text-center border border-surface-border shadow-sm">
                <span className="text-4xl block mb-3">📦</span>
                <h3 className="text-lg font-bold text-text-dark-heading mb-2 font-tajawal">
                  {isAr ? "لم يتم العثور على الطلب" : "Order not found"}
                </h3>
                <p className="text-text-dark-muted text-sm mb-1 font-tajawal">
                  {isAr ? "تأكد من رقم الطلب وحاول مرة أخرى" : "Check the order number and try again"}
                </p>
                <p className="text-text-dark-muted text-sm font-tajawal">
                  {isAr ? "أو تواصل معنا عبر واتساب" : "Or contact us via WhatsApp"}
                  {" "}
                  <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="text-accent hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    {siteConfig.contact.phone}
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {searched && loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-text-dark-muted text-sm font-tajawal">{isAr ? "جاري البحث عن طلبك..." : "Searching for your order..."}</p>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-accent hover:text-accent-hover text-sm font-medium font-tajawal">
            {isAr ? "← العودة للصفحة الرئيسية" : "← Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
