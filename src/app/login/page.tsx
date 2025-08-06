"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const { signIn, signInWithProvider } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Email atau password yang Anda masukkan salah. Silakan coba lagi.");
        } else {
          setError(error.message);
        }
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setError("");
    setSocialLoading(provider);

    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        setError(`Gagal masuk dengan ${provider === "google" ? "Google" : "GitHub"}: ${error.message}`);
      }
      // Note: redirect akan terjadi otomatis jika berhasil
    } catch {
      setError(`Terjadi kesalahan saat masuk dengan ${provider === "google" ? "Google" : "GitHub"}`);
    } finally {
      setSocialLoading(null);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Background Visuals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-green-300 opacity-20 blur-sm rotate-45"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-400 opacity-25 blur-sm rotate-12"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-yellow-300 opacity-15 blur-md -rotate-12"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
        <div className="absolute top-32 right-40 w-24 h-24 bg-purple-300 opacity-20 rounded-full blur-md"></div>
        <div className="absolute bottom-60 right-10 w-16 h-16 bg-pink-300 opacity-25 rounded-full blur-sm"></div>
        <div className="absolute top-60 left-40 w-32 h-32 bg-indigo-200 opacity-15 rounded-full blur-lg"></div>
        <div className="absolute bottom-0 left-0 right-0 opacity-10">
          <div className="absolute bottom-0 left-1/4 w-8 h-20 bg-gray-600 blur-sm"></div>
          <div className="absolute bottom-0 left-1/3 w-12 h-32 bg-gray-700 blur-sm"></div>
          <div className="absolute bottom-0 left-2/5 w-6 h-16 bg-gray-600 blur-sm"></div>
          <div className="absolute bottom-0 left-1/2 w-10 h-28 bg-gray-800 blur-sm"></div>
          <div className="absolute bottom-0 left-3/5 w-14 h-24 bg-gray-600 blur-sm"></div>
          <div className="absolute bottom-0 left-2/3 w-8 h-36 bg-gray-700 blur-sm"></div>
          <div className="absolute bottom-0 left-3/4 w-12 h-20 bg-gray-600 blur-sm"></div>
        </div>
        <div className="absolute top-16 left-1/3 w-28 h-28 bg-green-200 opacity-20 blur-xl rotate-45 rounded-lg"></div>
        <div className="absolute bottom-32 right-1/3 w-36 h-36 bg-blue-200 opacity-15 blur-2xl -rotate-12 rounded-full"></div>
        <div className="absolute top-52 right-60 w-14 h-14 bg-teal-300 opacity-25 blur-sm rotate-30"
          style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)" }}></div>
        <div className="absolute bottom-80 left-60 w-10 h-10 bg-orange-300 opacity-30 blur-sm -rotate-45"
          style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)" }}></div>
        <div className="absolute top-44 left-16 w-32 h-1 bg-green-400 opacity-20 blur-sm rotate-12"></div>
        <div className="absolute bottom-52 right-24 w-24 h-1 bg-blue-400 opacity-25 blur-sm -rotate-45"></div>
        <div className="absolute top-72 right-16 w-40 h-40 bg-gradient-to-r from-green-200 to-blue-200 opacity-20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-16 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 opacity-25 rounded-full blur-xl"></div>
      </div>

      {/* Main Box: Logo + Header + Form */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl px-8 py-10 shadow-xl border border-gray-200">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src="/logo.png" alt="Trackify" className="w-12 h-12 rounded-xl shadow-lg" />
              <span className="text-2xl font-black text-gray-800">Trackify</span>
            </div>
            <h1 className="text-3xl font-black text-gray-800 mb-2">Masuk ke Trackify</h1>
            <p className="text-gray-600 text-sm">
              Belum punya akun?{" "}
              <Link href="/register" className="text-green-600 hover:text-green-800 font-semibold transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading !== null || loading}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {socialLoading === "google" ? (
                <svg className="animate-spin h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>Masuk dengan Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin("github")}
              disabled={socialLoading !== null || loading}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {socialLoading === "github" ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              )}
              <span>Masuk dengan GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">atau</span>
            </div>
          </div>

          {/* Form Login */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                placeholder="nama@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              className="w-full bg-green-600 hover:from-green-700 hover:to-green-600 text-white py-3 px-4 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Memproses...</span>
                </div>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>
        </div>

        {/* Navigasi Tambahan */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">© 2025 Trackify. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  );
}