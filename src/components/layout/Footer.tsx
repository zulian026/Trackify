// src/components/layout/Footer.tsx
"use client";

export default function Footer() {
  return (
    <footer className=" py-12" style={{ backgroundColor: "#07305B" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img
              src="/Trackify.png"
              alt="Trackify"
              className="w-8 h-8 rounded-xl"
            />
            <span className="text-white text-xl font-semibold">Trackify</span>
          </div>
          <div className="text-white text-sm">
            © 2025 Trackify. Semua hak dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
}
