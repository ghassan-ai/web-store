// نظام auth وهمي يعتمد على localStorage
// مع دعم مراقبة التغييرات (listeners) حتى يتم تحديث الحالة تلقائياً

const listeners = new Set();

const notifyListeners = () => {
  const user = getCurrentUser();
  listeners.forEach(callback => callback(user));
};

const getCurrentUser = () => {
  try {
    const data = localStorage.getItem("fakeUser");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const signIn = async (email, password) => {
  if (email === "admin@admin.com" && password === "123456") {
    const fakeUser = { uid: "admin123", email: "admin@admin.com" };
    localStorage.setItem("fakeUser", JSON.stringify(fakeUser));
    // إشعار جميع الـ listeners بتغير حالة المستخدم
    notifyListeners();
    return fakeUser;
  }
  throw new Error("بيانات الدخول غير صحيحة");
};

export const signOut = async () => {
  localStorage.removeItem("fakeUser");
  // إشعار جميع الـ listeners بتسجيل الخروج
  notifyListeners();
};

export const onAuthChange = (callback) => {
  // إضافة الـ callback كـ listener
  listeners.add(callback);

  // استدعاء فوري بالحالة الحالية (مثل Firebase onAuthStateChanged)
  // localStorage متزامن، فلا حاجة لـ setTimeout
  callback(getCurrentUser());

  // إرجاع دالة unsubscribe
  return () => {
    listeners.delete(callback);
  };
};
