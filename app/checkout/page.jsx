'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MapPin, CreditCard, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { createOrder } from "@/firebase/orders";
import siteConfig from "@/config/siteConfig";
import { handleImgError } from "@/utils/imageHelpers";

const CITIES = [
  { value: "طرابلس", label: "طرابلس — توصيل مجاني", labelEn: "Tripoli — Free Delivery", fee: 0 },
  { value: "بيروت", label: "بيروت — $5", labelEn: "Beirut — $5", fee: 5 },
  { value: "جونية", label: "جونية — $5", labelEn: "Jounieh — $5", fee: 5 },
  { value: "صيدا", label: "صيدا — $5", labelEn: "Sidon — $5", fee: 5 },
  { value: "صور", label: "صور — $5", labelEn: "Tyre — $5", fee: 5 },
  { value: "زحلة", label: "زحلة — $5", labelEn: "Zahle — $5", fee: 5 },
  { value: "عكار", label: "عكار — $5", labelEn: "Akkar — $5", fee: 5 },
  { value: "أخرى", label: "منطقة أخرى — $5", labelEn: "Other area — $5", fee: 5 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { isAr, lang } = useLang();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartItems.reduce((t, item) => t + item.price * item.quantity, 0);
  const selectedCity = CITIES.find((c) => c.value === form.city);
  const deliveryFee = selectedCity ? selectedCity.fee : 0;
  const total = subtotal + deliveryFee;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = isAr ? "الاسم مطلوب" : "Name is required";
    if (!form.phone.trim()) {
      errs.phone = isAr ? "رقم الهاتف مطلوب" : "Phone is required";
    } else {
      const phoneClean = form.phone.replace(/[\s\-()]/g, "");
      const validPhone = /^(\+961|961|0)?(3|70|71|76|78|79|81)\d{6}$/.test(phoneClean);
      if (!validPhone) errs.phone = isAr ? "رقم هاتف غير صالح" : "Invalid phone number";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = isAr ? "بريد إلكتروني غير صالح" : "Invalid email";
    }
    if (!form.city) errs.city = isAr ? "اختر المدينة" : "Select a city";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const orderId = await createOrder({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        city: form.city,
        items: cartItems,
        total,
      });

      clearCart();
      router.push("/order-success?orderId=" + orderId);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const itemsText = cartItems.map((i) => `• ${i.name} × ${i.quantity} — $${i.price * i.quantity}`).join("\n");
    const text = isAr
      ? `مرحباً، أريد تقديم طلب:\n\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالمدينة: ${form.city}\nالعنوان: ${form.address}\n${form.notes ? "ملاحظات: " + form.notes + "\n" : ""}\nالمنتجات:\n${itemsText}\n\nالمجموع الفرعي: $${subtotal}\nالتوصيل: ${deliveryFee === 0 ? "مجاني" : "$" + deliveryFee}\nالإجمالي: $${total}`
      : `Hi, I'd like to place an order:\n\nName: ${form.name}\nPhone: ${form.phone}\nCity: ${form.city}\nAddress: ${form.address}\n${form.notes ? "Notes: " + form.notes + "\n" : ""}\nProducts:\n${itemsText}\n\nSubtotal: $${subtotal}\nDelivery: ${deliveryFee === 0 ? "Free" : "$" + deliveryFee}\nTotal: $${total}`;

    window.open(
      `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-primary">
        <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mb-4 border border-card-border">
          <ShoppingBag size={32} className="text-text-secondary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 font-tajawal">
          {isAr ? "السلة فارغة" : "Cart is empty"}
        </h2>
        <p className="text-text-secondary mb-6 text-sm font-tajawal">
          {isAr ? "أضف منتجات أولاً قبل إتمام الطلب" : "Add products before checking out"}
        </p>
        <button
          onClick={() => router.push("/products")}
          className="px-6 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors font-tajawal"
        >
          {isAr ? "تصفح المنتجات" : "Browse Products"}
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 font-tajawal">
          {isAr ? "إتمام الطلب" : "Checkout"}
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Section 1: Personal Info */}
            <div className="bg-card rounded-2xl p-6 border border-card-border">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2 font-tajawal">
                <span className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">1</span>
                {isAr ? "المعلومات الشخصية" : "Personal Information"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5 font-tajawal">
                    {isAr ? "الاسم الكامل" : "Full Name"} *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition bg-primary text-white ${errors.name ? "border-accent-rose" : "border-card-border"}`}
                    placeholder={isAr ? "مثال: أحمد محمد" : "e.g. Ahmad Mohammad"}
                  />
                  {errors.name && <p className="text-accent-rose text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5 font-tajawal">
                    {isAr ? "رقم الهاتف" : "Phone Number"} *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition bg-primary text-white font-mono ${errors.phone ? "border-accent-rose" : "border-card-border"}`}
                    placeholder="03 XXX XXX"
                    dir="ltr"
                  />
                  {errors.phone && <p className="text-accent-rose text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5 font-tajawal">
                    {isAr ? "البريد الإلكتروني" : "Email"} ({isAr ? "اختياري" : "optional"})
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition bg-primary text-white ${errors.email ? "border-accent-rose" : "border-card-border"}`}
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                  {errors.email && <p className="text-accent-rose text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Info */}
            <div className="bg-card rounded-2xl p-6 border border-card-border">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2 font-tajawal">
                <span className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">2</span>
                {isAr ? "معلومات التوصيل" : "Delivery Information"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5 font-tajawal">
                    <MapPin size={14} className="inline ml-1" />
                    {isAr ? "المدينة" : "City"} *
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 bg-primary text-white transition ${errors.city ? "border-accent-rose" : "border-card-border"}`}
                  >
                    <option value="">{isAr ? "— اختر المدينة —" : "— Select city —"}</option>
                    {CITIES.map((city) => (
                      <option key={city.value} value={city.value}>
                        {isAr ? city.label : city.labelEn}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className="text-accent-rose text-xs mt-1">{errors.city}</p>}
                  {form.city === "طرابلس" && (
                    <p className="text-accent-emerald text-xs mt-2 font-medium flex items-center gap-1">
                      <Check size={14} />
                      {isAr ? "توصيل مجاني إلى طرابلس" : "Free delivery to Tripoli"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5 font-tajawal">
                    {isAr ? "العنوان التفصيلي" : "Street Address"} *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition bg-primary text-white ${errors.address ? "border-accent-rose" : "border-card-border"}`}
                    placeholder={isAr ? "الشارع، البناية، الطابق..." : "Street, building, floor..."}
                  />
                  {errors.address && <p className="text-accent-rose text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5 font-tajawal">
                    {isAr ? "ملاحظات إضافية" : "Special Instructions"} ({isAr ? "اختياري" : "optional"})
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full border border-card-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition resize-none bg-primary text-white"
                    placeholder={isAr ? "مثال: اتصل قبل التوصيل" : "e.g. Call before delivery"}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Payment */}
            <div className="bg-card rounded-2xl p-6 border border-card-border">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2 font-tajawal">
                <span className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">3</span>
                {isAr ? "طريقة الدفع" : "Payment Method"}
              </h2>
              <div className="flex items-center gap-3 p-4 bg-accent/10 border-2 border-accent rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm font-tajawal">{isAr ? "الدفع عند الاستلام" : "Cash on Delivery"}</p>
                  <p className="text-xs text-text-secondary font-tajawal">{isAr ? "ادفع نقداً عند استلام طلبك" : "Pay cash when you receive your order"}</p>
                </div>
                <CreditCard size={20} className="text-accent mr-auto" />
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 border border-card-border sticky top-20">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2 font-tajawal">
                <ShoppingBag size={18} className="text-accent" />
                {isAr ? "ملخص الطلب" : "Order Summary"}
              </h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      loading="lazy"
                      src={item.imageUrl || ""}
                      className="w-12 h-12 rounded-lg object-cover bg-white flex-shrink-0"
                      alt={item.name}
                      onError={handleImgError}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate font-tajawal">{item.name}</p>
                      <p className="text-xs text-text-secondary">×{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-white font-mono" dir="ltr">${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-card-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary font-tajawal">{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="font-medium text-white font-mono" dir="ltr">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary font-tajawal">{isAr ? "التوصيل" : "Delivery"}</span>
                  <span className={`font-medium font-mono ${deliveryFee === 0 && form.city ? "text-accent-emerald" : "text-white"}`} dir="ltr">
                    {!form.city ? "—" : deliveryFee === 0 ? (isAr ? "مجاني" : "Free") : `$${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-card-border">
                  <span className="text-white font-tajawal">{isAr ? "الإجمالي" : "Total"}</span>
                  <span className="text-accent font-mono" dir="ltr">${total}</span>
                </div>
              </div>

              {errors.submit && (
                <p className="text-accent-rose text-xs mt-3">{errors.submit}</p>
              )}

              <div className="mt-5 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-colors disabled:bg-card-border disabled:text-text-secondary disabled:cursor-not-allowed font-tajawal"
                >
                  {submitting
                    ? (isAr ? "جارٍ إرسال الطلب..." : "Submitting...")
                    : (isAr ? "قم بتقديم الطلب" : "Place Order")}
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 bg-accent-emerald text-white font-bold rounded-xl hover:brightness-110 transition-colors flex items-center justify-center gap-2 font-tajawal"
                >
                  <MessageCircle size={18} />
                  {isAr ? "اطلب عبر واتساب" : "Order via WhatsApp"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
