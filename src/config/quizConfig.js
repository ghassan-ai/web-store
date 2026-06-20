const FIRST_QUESTION = {
  id: "category",
  question: "ما الذي تبحث عنه؟",
  questionEn: "What are you looking for?",
  icon: "🛍️",
  options: [
    { label: "هاتف ذكي", labelEn: "Phone", value: "phone", emoji: "📱" },
    { label: "كفرات وإكسسوارات", labelEn: "Accessories & Cases", value: "accessories", emoji: "🎒" },
    { label: "سماعات وصوتيات", labelEn: "Audio & Speakers", value: "audio", emoji: "🎧" },
    { label: "شحن وطاقة", labelEn: "Power & Charging", value: "power", emoji: "🔋" },
    { label: "تابلت", labelEn: "Tablets", value: "tablets", emoji: "📟" },
    { label: "أخرى", labelEn: "Other", value: "other", emoji: "📦" },
  ],
};

const QUIZ_FLOWS = {
  phone: {
    categories: ["phone"],
    questions: [
      {
        id: "budget",
        question: "ما هي ميزانيتك؟",
        questionEn: "What's your budget?",
        icon: "💰",
        options: [
          { label: "أقل من 300$", labelEn: "Under $300", value: "under300", maxPrice: 300 },
          { label: "300$ - 500$", labelEn: "$300 - $500", value: "300-500", minPrice: 300, maxPrice: 500 },
          { label: "500$ - 700$", labelEn: "$500 - $700", value: "500-700", minPrice: 500, maxPrice: 700 },
          { label: "700$ - 1000$", labelEn: "$700 - $1000", value: "700-1000", minPrice: 700, maxPrice: 1000 },
          { label: "أكثر من 1000$", labelEn: "Over $1000", value: "over1000", minPrice: 1000 },
        ],
      },
      {
        id: "usage",
        question: "ما هو استخدامك الأساسي؟",
        questionEn: "What's your primary use?",
        icon: "🎯",
        options: [
          { label: "تصوير واحترافي", labelEn: "Photography", value: "camera" },
          { label: "ألعاب وأداء عالي", labelEn: "Gaming & Performance", value: "gaming" },
          { label: "عمل ومهني", labelEn: "Business & Work", value: "business" },
          { label: "استخدام يومي عادي", labelEn: "Normal daily use", value: "normal" },
        ],
      },
      {
        id: "brand",
        question: "ما هي الماركة المفضلة؟",
        questionEn: "Preferred brand?",
        icon: "🏷️",
        options: [
          { label: "Apple", labelEn: "Apple", value: "Apple" },
          { label: "Samsung", labelEn: "Samsung", value: "Samsung" },
          { label: "Huawei", labelEn: "Huawei", value: "Huawei" },
          { label: "Xiaomi", labelEn: "Xiaomi", value: "Xiaomi" },
          { label: "لا يهمني", labelEn: "No preference", value: "any" },
        ],
      },
      {
        id: "condition",
        question: "ما هي حالة المنتج المطلوبة؟",
        questionEn: "What condition do you prefer?",
        icon: "✨",
        options: [
          { label: "جديد", labelEn: "New", value: "new" },
          { label: "مستعمل", labelEn: "Used", value: "used" },
          { label: "مجدد", labelEn: "Refurbished", value: "refurbished" },
          { label: "لا يهمني", labelEn: "Any", value: "any" },
        ],
      },
    ],
  },

  accessories: {
    categories: ["case", "accessory"],
    questions: [
      {
        id: "type",
        question: "ما نوع الإكسسوار؟",
        questionEn: "What type of accessory?",
        icon: "🔧",
        options: [
          { label: "كفر حماية", labelEn: "Phone Case", value: "case" },
          { label: "حماية شاشة", labelEn: "Screen Protector", value: "screen" },
          { label: "شاحن", labelEn: "Charger", value: "charger" },
          { label: "كيبل", labelEn: "Cable", value: "cable" },
          { label: "حامل / ستاند", labelEn: "Mount / Stand", value: "mount" },
          { label: "أخرى", labelEn: "Other", value: "other" },
        ],
      },
      {
        id: "brand",
        question: "لأي ماركة هاتف؟",
        questionEn: "For which phone brand?",
        icon: "📱",
        options: [
          { label: "Apple / iPhone", labelEn: "Apple / iPhone", value: "Apple" },
          { label: "Samsung", labelEn: "Samsung", value: "Samsung" },
          { label: "عالمي / Universal", labelEn: "Universal", value: "any" },
          { label: "أخرى", labelEn: "Other", value: "other" },
        ],
      },
      {
        id: "budget",
        question: "ما هي ميزانيتك؟",
        questionEn: "What's your budget?",
        icon: "💰",
        options: [
          { label: "أقل من 20$", labelEn: "Under $20", value: "under20", maxPrice: 20 },
          { label: "20$ - 50$", labelEn: "$20 - $50", value: "20-50", minPrice: 20, maxPrice: 50 },
          { label: "أكثر من 50$", labelEn: "Over $50", value: "over50", minPrice: 50 },
        ],
      },
    ],
  },

  audio: {
    categories: ["speaker", "apple-accessory"],
    questions: [
      {
        id: "type",
        question: "ما نوع الصوتيات؟",
        questionEn: "What type of audio?",
        icon: "🎵",
        options: [
          { label: "سماعات لاسلكية", labelEn: "Wireless Earbuds", value: "earbuds" },
          { label: "سماعات رأس", labelEn: "Over-ear Headphones", value: "headphones" },
          { label: "سبيكر محمول", labelEn: "Portable Speaker", value: "speaker" },
          { label: "أخرى", labelEn: "Other", value: "other" },
        ],
      },
      {
        id: "budget",
        question: "ما هي ميزانيتك؟",
        questionEn: "What's your budget?",
        icon: "💰",
        options: [
          { label: "أقل من 50$", labelEn: "Under $50", value: "under50", maxPrice: 50 },
          { label: "50$ - 150$", labelEn: "$50 - $150", value: "50-150", minPrice: 50, maxPrice: 150 },
          { label: "أكثر من 150$", labelEn: "Over $150", value: "over150", minPrice: 150 },
        ],
      },
      {
        id: "brand",
        question: "ما هي الماركة المفضلة؟",
        questionEn: "Preferred brand?",
        icon: "🏷️",
        options: [
          { label: "Apple", labelEn: "Apple", value: "Apple" },
          { label: "JBL", labelEn: "JBL", value: "JBL" },
          { label: "Samsung", labelEn: "Samsung", value: "Samsung" },
          { label: "لا يهمني", labelEn: "No preference", value: "any" },
        ],
      },
    ],
  },

  power: {
    categories: ["power-bank"],
    questions: [
      {
        id: "type",
        question: "ما الذي تحتاجه؟",
        questionEn: "What do you need?",
        icon: "⚡",
        options: [
          { label: "باور بانك", labelEn: "Power Bank", value: "powerbank" },
          { label: "شاحن سريع", labelEn: "Fast Charger", value: "charger" },
          { label: "شاحن لاسلكي", labelEn: "Wireless Charger", value: "wireless" },
          { label: "كيبل شحن", labelEn: "Charging Cable", value: "cable" },
        ],
      },
      {
        id: "budget",
        question: "ما هي ميزانيتك؟",
        questionEn: "What's your budget?",
        icon: "💰",
        options: [
          { label: "أقل من 30$", labelEn: "Under $30", value: "under30", maxPrice: 30 },
          { label: "30$ - 60$", labelEn: "$30 - $60", value: "30-60", minPrice: 30, maxPrice: 60 },
          { label: "أكثر من 60$", labelEn: "Over $60", value: "over60", minPrice: 60 },
        ],
      },
    ],
  },

  tablets: {
    categories: ["tablet"],
    questions: [
      {
        id: "budget",
        question: "ما هي ميزانيتك؟",
        questionEn: "What's your budget?",
        icon: "💰",
        options: [
          { label: "أقل من 400$", labelEn: "Under $400", value: "under400", maxPrice: 400 },
          { label: "400$ - 700$", labelEn: "$400 - $700", value: "400-700", minPrice: 400, maxPrice: 700 },
          { label: "أكثر من 700$", labelEn: "Over $700", value: "over700", minPrice: 700 },
        ],
      },
      {
        id: "usage",
        question: "ما هو الاستخدام الأساسي؟",
        questionEn: "What's the primary use?",
        icon: "🎯",
        options: [
          { label: "عمل وإنتاجية", labelEn: "Work & Productivity", value: "work" },
          { label: "ترفيه ومشاهدة", labelEn: "Entertainment", value: "entertainment" },
          { label: "رسم وإبداع", labelEn: "Drawing & Creativity", value: "creative" },
          { label: "دراسة وتعليم", labelEn: "Student", value: "student" },
        ],
      },
      {
        id: "brand",
        question: "ما هي الماركة المفضلة؟",
        questionEn: "Preferred brand?",
        icon: "🏷️",
        options: [
          { label: "Apple / iPad", labelEn: "Apple / iPad", value: "Apple" },
          { label: "Samsung", labelEn: "Samsung", value: "Samsung" },
          { label: "لا يهمني", labelEn: "No preference", value: "any" },
        ],
      },
    ],
  },

  other: {
    categories: null,
    questions: [
      {
        id: "budget",
        question: "ما هي ميزانيتك؟",
        questionEn: "What's your budget?",
        icon: "💰",
        options: [
          { label: "أقل من 50$", labelEn: "Under $50", value: "under50", maxPrice: 50 },
          { label: "50$ - 200$", labelEn: "$50 - $200", value: "50-200", minPrice: 50, maxPrice: 200 },
          { label: "أكثر من 200$", labelEn: "Over $200", value: "over200", minPrice: 200 },
        ],
      },
    ],
  },
};

export function getQuizFlow(categoryAnswer) {
  return QUIZ_FLOWS[categoryAnswer] || QUIZ_FLOWS.other;
}

function inferBrand(name) {
  if (!name) return "";
  const lower = name.toLowerCase();
  if (lower.includes("iphone") || lower.includes("ipad") || lower.includes("airpods") || lower.includes("apple")) return "Apple";
  if (lower.includes("samsung") || lower.includes("galaxy")) return "Samsung";
  if (lower.includes("huawei") || lower.includes("mate") || lower.includes("nova")) return "Huawei";
  if (lower.includes("xiaomi") || lower.includes("redmi")) return "Xiaomi";
  if (lower.includes("oneplus")) return "OnePlus";
  if (lower.includes("jbl")) return "JBL";
  if (lower.includes("anker")) return "Anker";
  return "";
}

export function matchProducts(products, answers) {
  const flow = QUIZ_FLOWS[answers.category] || QUIZ_FLOWS.other;

  let list = products.filter(p => p.isActive !== false && p.stock > 0);

  if (flow.categories) {
    list = list.filter(p => flow.categories.includes(p.category));
  }

  const budgetQ = flow.questions.find(q => q.id === "budget");
  const budgetAnswer = budgetQ?.options.find(o => o.value === answers.budget);

  const scored = list.map(product => {
    let score = 0;
    const productBrand = inferBrand(product.name);

    if (budgetAnswer) {
      const { minPrice, maxPrice } = budgetAnswer;
      const inRange = (!minPrice || product.price >= minPrice) && (!maxPrice || product.price <= maxPrice);
      if (inRange) {
        score += 35;
      } else {
        score -= 40;
      }
    }

    if (answers.brand && answers.brand !== "any" && answers.brand !== "other") {
      if (productBrand === answers.brand) score += 40;
      else if (productBrand) score -= 10;
    }

    if (answers.usage) {
      switch (answers.usage) {
        case "camera":
          if (["Apple", "Samsung", "Huawei"].includes(productBrand)) score += 15;
          if (product.price >= 800) score += 10;
          break;
        case "gaming":
          if (product.price >= 700) score += 15;
          if (["Apple", "Samsung", "OnePlus", "Xiaomi"].includes(productBrand)) score += 10;
          break;
        case "business":
          if (["Apple", "Samsung"].includes(productBrand)) score += 15;
          break;
        case "normal":
          if (product.price <= 600) score += 15;
          break;
        case "work":
        case "creative":
          if (product.price >= 500) score += 10;
          break;
        case "entertainment":
        case "student":
          if (product.price <= 700) score += 10;
          break;
      }
    }

    return { ...product, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, 4);
}

export { FIRST_QUESTION, QUIZ_FLOWS };
export default { FIRST_QUESTION, QUIZ_FLOWS };
