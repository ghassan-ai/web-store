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
    notifyListeners();
    return fakeUser;
  }
  throw new Error("بيانات الدخول غير صحيحة");
};

export const signOut = async () => {
  localStorage.removeItem("fakeUser");
  notifyListeners();
};

export const onAuthChange = (callback) => {
  listeners.add(callback);
  callback(getCurrentUser());
  return () => {
    listeners.delete(callback);
  };
};
