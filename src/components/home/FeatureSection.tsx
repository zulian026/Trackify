// src/components/FeaturesSection.js
import { FaWallet, FaChartPie, FaBullseye } from "react-icons/fa";

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Fitur Unggulan <span className="text-green-600">Trackify</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
          Trackify hadir dengan fitur lengkap untuk membantu Anda mengelola keuangan pribadi secara cerdas, terstruktur, dan efisien.
        </p>

        {/* Fitur Grid */}
        <div className="grid md:grid-cols-3 gap-10 text-left">
          {/* Fitur 1 - Manajemen Transaksi */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-green-600 text-3xl mb-4">
              <FaWallet />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Manajemen Transaksi</h3>
            <p className="text-gray-600">
              Catat pemasukan dan pengeluaran harian dengan kategori, tanggal, dan deskripsi. Dukungan transaksi berulang otomatis.
            </p>
          </div>

          {/* Fitur 2 - Analisis Keuangan */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-green-600 text-3xl mb-4">
              <FaChartPie />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analisis Keuangan</h3>
            <p className="text-gray-600">
              Visualisasi pengeluaran dan pemasukan dengan grafik interaktif serta laporan mendalam untuk membantu pengambilan keputusan.
            </p>
          </div>

          {/* Fitur 3 - Pengelolaan Anggaran */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-green-600 text-3xl mb-4">
              <FaBullseye />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Manajemen Anggaran</h3>
            <p className="text-gray-600">
              Tetapkan dan pantau anggaran bulanan atau tahunan per kategori. Dapatkan notifikasi saat mendekati batas anggaran.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
