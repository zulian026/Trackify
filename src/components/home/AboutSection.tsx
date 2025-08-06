// src/components/AboutSection.js
export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
        {/* Ilustrasi */}
        <div className="flex justify-center md:justify-start">
          <img
            src="/finance-illustration.svg" // Ganti dengan ilustrasi bertema keuangan jika tersedia
            alt="Tentang Trackify"
            className="w-full max-w-md"
          />
        </div>

        {/* Teks */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Tentang <span className="text-green-600">Trackify</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Trackify adalah aplikasi manajemen keuangan personal yang dirancang
            untuk membantu Anda mencatat, memantau, dan menganalisis pemasukan
            serta pengeluaran dengan cara yang cerdas dan efisien.
          </p>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3">
              ✅{" "}
              <span>
                Catat transaksi harian dengan kategori yang bisa dikustomisasi.
              </span>
            </li>
            <li className="flex items-start gap-3">
              ✅{" "}
              <span>
                Tetapkan anggaran bulanan dan pantau realisasinya secara real-time.
              </span>
            </li>
            <li className="flex items-start gap-3">
              ✅{" "}
              <span>
                Analisis keuangan dengan grafik interaktif dan laporan mendalam.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
