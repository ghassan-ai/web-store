const siteConfig = {
  storeName: "لبنان فون ستور",
  storeNameEn: "Lebanon Phone Store",
  tagline: "وجهتك الأولى للهواتف الذكية والإكسسوارات في لبنان",
  description: "نوفر لك أحدث الهواتف الذكية بأفضل الأسعار مع ضمان الجودة وخدمة ما بعد البيع.",
  foundedYear: 2024,

  contact: {
    phone: "+961 71 094 407",
    whatsapp: "96171094407",
    email: "info@lebphonestore.com",
    instagram: "https://www.instagram.com/lebphonestore",
    facebook: "https://www.facebook.com/lebphonestore",
    address: "بيروت، لبنان",
  },

  navLinks: [
    { label: "الرئيسية", labelEn: "Home", path: "/" },
    { label: "المتجر", labelEn: "Shop", path: "/products" },
    { label: "الاختبار", labelEn: "Quiz", path: "/quiz" },
    { label: "تتبع طلبك", labelEn: "Track Order", path: "/track-order" },
    { label: "تواصل معنا", labelEn: "Contact", path: "/#contact" },
  ],

  categories: [
    { label: "هواتف ذكية", path: "/products" },
    { label: "إكسسوارات", path: "/products" },
    { label: "سماعات", path: "/products" },
    { label: "شواحن وكوابل", path: "/products" },
    { label: "حمايات شاشة", path: "/products" },
  ],

  stats: {
    customers: "10,000+",
    supportLabel: "24/7",
  },

  copyright: {
    year: new Date().getFullYear(),
    madeIn: "صنع بـ ❤️ في لبنان",
  },
};

export default siteConfig;
