'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { signIn, onAuthChange } from "@/supabase/auth";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      if (currentUser) {
        router.replace("/admin");
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch (err) {
      setError("فشل تسجيل الدخول. تحقق من البيانات وجرب مجددًا.");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="login-bg dark-context flex items-center justify-center min-h-[calc(100vh-56px)]">
      <form
        onSubmit={handleSubmit}
        className="login-card bg-white rounded-lg shadow max-w-md w-full p-8 flex flex-col gap-5"
        style={{ direction: "rtl" }}
      >
        <h1 className="text-xl text-center font-bold mb-2 text-[var(--text-dark)]">دخول الأدمن</h1>
        <div>
          <label className="block text-sm mb-1 text-[var(--text-dark)]">البريد الإلكتروني</label>
          <input
            type="email"
            className="login-inp"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[var(--text-dark)]">كلمة المرور</label>
          <input
            type="password"
            className="login-inp"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <div className="text-center text-red-600 text-sm mt-1">{error}</div>}
        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "...انتظر قليلاً" : "دخــول"}
        </button>
      </form>
    </div>
  );
}
