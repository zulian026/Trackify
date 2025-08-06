// src/components/Navbar.js
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur transition-all duration-300 ${
        isScrolled ? " shadow-lg border-b border-gray-200" : " shadow-md"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-4 transition-all duration-300 ${
          isScrolled ? "py-3" : "py-4"
        }`}
      >
        <div className="flex justify-between items-center">
          {/* Logo dan nama aplikasi */}
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo"
              className={`transition-all duration-300 ${
                isScrolled ? "w-8 h-8" : "w-9 h-9"
              }`}
            />
            <span
              className={`font-bold text-gray-800 transition-all duration-300 ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
            >
              Trackify
            </span>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#hero"
              className="text-gray-800 hover:text-green-700 transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-gray-800 hover:text-green-700 transition-colors"
            >
              Tentang
            </a>
            <a
              href="#features"
              className="text-gray-800 hover:text-green-700 transition-colors"
            >
              Fitur
            </a>
            <a
              href="#contact"
              className="text-gray-800 hover:text-green-700 transition-colors"
            >
              Kontak
            </a>
          </div>

          {/* Desktop Auth Buttons - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-800 hover:text-green-700 font-medium transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile menu - Slides down when open */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-85 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-4 pb-2 space-y-3">
            {/* Mobile Navigation Links */}
            <a
              href="#hero"
              onClick={closeMenu}
              className="block py-2 text-gray-800 hover:text-green-700 transition-colors border-b border-gray-200"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={closeMenu}
              className="block py-2 text-gray-800 hover:text-green-700 transition-colors border-b border-gray-200"
            >
              Tentang
            </a>
            <a
              href="#features"
              onClick={closeMenu}
              className="block py-2 text-gray-800 hover:text-green-700 transition-colors border-b border-gray-200"
            >
              Fitur
            </a>
            <a
              href="#contact"
              onClick={closeMenu}
              className="block py-2 text-gray-800 hover:text-green-700 transition-colors border-b border-gray-200"
            >
              Kontak
            </a>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-3">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block text-center py-2 text-gray-800 hover:text-green-700 font-medium transition-colors border border-gray-300 rounded-full"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className="block text-center bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
