'use client';
import { useState, useCallback, useEffect } from "react";
import { MessageCircle, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";
import { FIRST_QUESTION, getQuizFlow, matchProducts } from "@/config/quizConfig";
import { handleImgError } from "@/utils/imageHelpers";

function QuizModal({ isOpen, onClose, products }) {
  const { isAr } = useLang();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [flow, setFlow] = useState(null);

  const currentQuestions = flow ? [FIRST_QUESTION, ...flow.questions] : [FIRST_QUESTION];
  const totalSteps = currentQuestions.length;

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnswers({});
      setResults(null);
      setFlow(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSelect = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (questionId === "category") {
      const selectedFlow = getQuizFlow(value);
      setFlow(selectedFlow);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setResults(matchProducts(products, answers));
    }
  }, [currentStep, totalSteps, products, answers]);

  const handlePrev = useCallback(() => {
    if (results) {
      setResults(null);
    } else if (currentStep > 0) {
      if (currentStep === 1) {
        setFlow(null);
        setAnswers((prev) => {
          const next = { ...prev };
          delete next[currentQuestions[1]?.id];
          return next;
        });
      }
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep, results, currentQuestions]);

  if (!isOpen) return null;

  const currentQ = currentQuestions[currentStep];
  const isAnswered = answers[currentQ?.id];
  const progress = results ? 100 : ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-card rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border border-card-border" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-card-border">
          <h3 className="font-bold text-white font-tajawal">
            {results ? (isAr ? "النتائج" : "Results") : (isAr ? "اختبار اختر منتجك" : "Find Your Product")}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center">
            <X size={18} className="text-text-secondary" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4">
          <div className="h-1.5 bg-primary rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-text-secondary mt-2">
            {results
              ? (isAr ? "تم العثور على المنتجات المناسبة!" : "Found matching products!")
              : (isAr ? `السؤال ${currentStep + 1} من ${totalSteps}` : `Question ${currentStep + 1} of ${totalSteps}`)}
          </p>
        </div>

        {/* Content */}
        {results ? (
          <div className="p-5">
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-primary rounded-xl border border-card-border">
                    <img
                      loading="lazy"
                      src={product.imageUrl || ""}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-white"
                      onError={handleImgError}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate font-tajawal">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-accent font-mono" dir="ltr">${product.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="text-3xl block mb-3">😕</span>
                <p className="text-text-secondary text-sm font-tajawal">
                  {isAr ? "لم نجد منتجات مطابقة حالياً. جرب خيارات مختلفة!" : "No matching products found. Try different options!"}
                </p>
              </div>
            )}
            <button
              onClick={() => { setCurrentStep(0); setAnswers({}); setResults(null); setFlow(null); }}
              className="w-full mt-4 py-2.5 text-sm font-medium text-accent border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
            >
              {isAr ? "أعد الاختبار" : "Retry Quiz"}
            </button>
          </div>
        ) : (
          <div className="p-5">
            <div className="text-center mb-4">
              <span className="text-3xl">{currentQ.icon}</span>
              <h4 className="text-base font-semibold text-white mt-2 font-tajawal">
                {isAr ? currentQ.question : currentQ.questionEn}
              </h4>
            </div>
            <div className="space-y-2">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-start px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    answers[currentQ.id] === option.value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-card-border text-text-secondary hover:border-accent/30"
                  }`}
                  onClick={() => handleSelect(currentQ.id, option.value)}
                >
                  <span className="flex items-center gap-2">
                    {option.emoji && <span>{option.emoji}</span>}
                    {isAr ? option.label : option.labelEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        {!results && (
          <div className="flex items-center justify-between p-5 pt-0">
            {currentStep > 0 ? (
              <button onClick={handlePrev} className="flex items-center gap-1 text-sm text-text-secondary hover:text-white">
                {isAr ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                {isAr ? "السابق" : "Previous"}
              </button>
            ) : <div />}
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-1 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-all disabled:bg-card-border disabled:text-text-secondary disabled:cursor-not-allowed"
            >
              {currentStep === totalSteps - 1 ? (isAr ? "عرض النتائج" : "Show Results") : (isAr ? "التالي" : "Next")}
              {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductQuiz({ products = [] }) {
  const { isAr } = useLang();
  const [quizOpen, setQuizOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    isAr ? "مرحباً، أريد الاستفسار عن منتج من متجر " + siteConfig.storeName : "Hi, I'd like to inquire about a product"
  )}`;

  return (
    <>
      <section className="py-14 sm:py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quiz Card */}
            <div className="bg-card rounded-2xl p-8 sm:p-10 border border-card-border text-center hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5">
              <span className="text-4xl block mb-5">🤔</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-tajawal">
                {isAr ? "مش عارف شو تختار؟" : "Not sure what to pick?"}
              </h3>
              <p className="text-text-secondary text-sm sm:text-base mb-7 max-w-sm mx-auto font-tajawal">
                {isAr ? "أجب على بضعة أسئلة ذكية ونحن نختار لك الأنسب" : "Answer a few smart questions and we'll find the best match"}
              </p>
              <button
                onClick={() => setQuizOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all duration-300"
              >
                <Sparkles size={18} />
                {isAr ? "ابدأ الاختبار" : "Start Quiz"}
              </button>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-card rounded-2xl p-8 sm:p-10 border border-card-border text-center hover:border-accent-emerald/40 transition-all duration-300 hover:-translate-y-0.5">
              <span className="text-4xl block mb-5">💬</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-tajawal">
                {isAr ? "اطلب عبر واتساب" : "Order via WhatsApp"}
              </h3>
              <p className="text-text-secondary text-sm sm:text-base mb-7 max-w-sm mx-auto font-tajawal">
                {isAr ? "تواصل معنا مباشرة على واتساب واطلب أي منتج بكل سهولة" : "Contact us directly on WhatsApp to order any product"}
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-emerald text-white font-semibold rounded-xl hover:brightness-110 transition-all duration-300"
              >
                <MessageCircle size={18} />
                {isAr ? "ابدأ المحادثة" : "Start Chat"}
              </a>
            </div>
          </div>
        </div>
      </section>

      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} products={products} />
    </>
  );
}
