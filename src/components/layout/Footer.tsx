// src/components/Footer.js
export default function Footer() {
  return (
    <footer className="text-gray-700 py-10 bg-white border border-b-gray-950">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Trackify</h3>
          <p className="text-sm">
            Aplikasi manajemen keuangan pribadi untuk mencatat, memantau, dan
            menganalisis pemasukan serta pengeluaran Anda dengan mudah.
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <h4 className="font-semibold mb-2">Navigasi</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#hero" className="hover:text-green-600">
                Beranda
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-green-600">
                Fitur
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-green-600">
                Tentang
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-600">
                Kontak
              </a>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="font-semibold mb-2">Kontak</h4>
          <p className="text-sm">Email: zulianalhisyam@gmial.com</p>
          <p className="text-sm">WhatsApp: +62 852-7914-1146</p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Trackify. All rights reserved.
      </div>
    </footer>
  );
}
