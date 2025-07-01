"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <nav className="bg-[#07305B]/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-[#07305B]/20 w-full transition-all duration-300 hover:shadow-2xl hover:shadow-[#07305B]/30">
        <div className="px-4 sm:px-6 py-2.5">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 group">
              <div className="relative">
                <img
                  src="/Trackify.png"
                  alt="Trackify"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-blue-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-lg sm:text-xl font-black text-white tracking-tight">
                Trackify
              </span>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex space-x-6 text-blue-100 font-semibold text-sm">
              <a
                href="#home"
                className="relative hover:text-white transition-all duration-300 group py-2"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#fitur"
                className="relative hover:text-white transition-all duration-300 group py-2"
              >
                Fitur
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-white group-hover:w-full transition-all duration-300"></span>
              </a>
              {/* <a
                href="#testimoni"
                className="relative hover:text-white transition-all duration-300 group py-2"
              >
                Testimoni
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-white group-hover:w-full transition-all duration-300"></span>
              </a> */}
              <a
                href="#faq"
                className="relative hover:text-white transition-all duration-300 group py-2"
              >
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-white group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                href="/login"
                className="text-blue-100 hover:text-white font-semibold px-3 py-1.5 text-sm rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="relative bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-white text-[#07305B] px-4 py-2 text-sm rounded-xl font-bold shadow-lg shadow-blue-400/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/40 hover:-translate-y-0.5 overflow-hidden group"
              >
                <span className="relative z-10">Daftar Gratis</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                <span
                  className={`block w-4 h-0.5 bg-blue-100 transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block w-4 h-0.5 bg-blue-100 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-4 h-0.5 bg-blue-100 transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="pt-4 pb-2 border-t border-white/20 mt-3">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-3 mb-4">
                <a
                  href="#fitur"
                  className="text-blue-100 hover:text-white font-semibold py-2 px-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Fitur
                </a>
                {/* <a
                  href="#testimoni"
                  className="text-blue-100 hover:text-white font-semibold py-2 px-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimoni
                </a> */}
                <a
                  href="#faq"
                  className="text-blue-100 hover:text-white font-semibold py-2 px-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </a>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col space-y-3 sm:hidden">
                <Link
                  href="/login"
                  className="text-center text-blue-100 hover:text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="text-center bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-white text-[#07305B] py-2.5 px-4 rounded-xl font-bold shadow-lg shadow-blue-400/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/40"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
