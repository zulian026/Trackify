"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    if (password.length < 6) {
      setError("Password harus minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("already exists")
        ) {
          setError("Email sudah terdaftar. Silakan gunakan email lain atau masuk.");
        } else if (error.message.includes("Invalid email")) {
          setError("Format email tidak valid.");
        } else {
          setError(error.message);
        }
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8 relative">

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

      {/* Container utama dengan border & form */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">

          {/* Logo dan Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img
                src="/logo.png"
                alt="Trackify"
                className="w-12 h-12 rounded-xl shadow-lg"
              />
              <span className="text-2xl font-black text-gray-800 tracking-tight">
                Trackify
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-800 mb-2">
              Daftar ke Trackify
            </h1>
            <p className="text-gray-600 text-sm">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Nama Lengkap */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300"
                placeholder="nama@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300"
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300"
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Tombol Daftar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-green-800/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
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
                <>
                  <span className="relative z-10">Daftar</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
          >
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
