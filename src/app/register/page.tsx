"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
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
        // Mengustomisasi pesan error umum
        if (
          error.message.includes("already registered") ||
          error.message.includes("already exists")
        ) {
          setError(
            "Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda."
          );
        } else if (error.message.includes("Invalid email")) {
          setError(
            "Format email tidak valid. Silakan periksa kembali email Anda."
          );
        } else if (error.message.includes("Password")) {
          setError("Password tidak memenuhi kriteria yang diperlukan.");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background dengan kurva */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundColor: "#07305B" }}
      >
        {/* Curved overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/30"></div>

        {/* Curved shape */}
        <div className="absolute top-0 -right-20 w-96 h-full bg-gradient-to-l from-white/5 to-transparent transform rotate-12 origin-top"></div>

        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-500/25 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-300"></div>
        </div>

        {/* Content pada background */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <img
                  src="/Trackify.png"
                  alt="Trackify"
                  className="w-16 h-16 rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-blue-200/30"></div>
              </div>
              <span className="text-4xl font-black text-white tracking-tight">
                Trackify
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Bergabung dengan Trackify
            </h1>
            <p className="text-blue-100/80 text-lg max-w-md mx-auto leading-relaxed">
              Mulai kelola proyek Anda dengan mudah dan efisien bersama kami
            </p>
          </div>

          {/* Decorative elements */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Curved border */}
        <div className="absolute top-0 right-0 w-32 h-full">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,0 Q50,50 0,100 L100,100 L100,0 Z"
              fill="white"
              fillOpacity="0.05"
            />
          </svg>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo (hidden on desktop) */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <img
                  src="/Trackify.png"
                  alt="Trackify"
                  className="w-12 h-12 rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500/20 to-blue-200/30"></div>
              </div>
              <span className="text-2xl font-black text-gray-800 tracking-tight">
                Trackify
              </span>
            </div>
          </div>

          {/* Register Header */}
          <div className="text-center lg:text-left mb-6">
            <h1 className="text-3xl font-black text-gray-800 mb-2">
              Daftar ke Trackify
            </h1>
            <p className="text-gray-600 text-sm">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="nama@email.com"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Ulangi password"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Daftar Gratis</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">
              © 2025 Trackify. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
