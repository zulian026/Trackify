// src/components/home/FeaturesSection.tsx
"use client";

import {
  PieChart,
  Wallet,
  TrendingUp,
  Shield,
  Bell,
  Smartphone,
  CreditCard,
  Target,
  BarChart3,
  Calendar,
  Settings,
  Globe,
  Moon,
  DollarSign,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Wallet,
      title: "Manajemen Transaksi",
      description:
        "Catat pemasukan dan pengeluaran dengan kategori kustom, tanggal, dan deskripsi. Otomatisasi transaksi berulang harian, mingguan, bulanan, atau tahunan.",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      icon: PieChart,
      title: "Analisis & Visualisasi",
      description:
        "Dashboard ringkasan dengan grafik interaktif untuk visualisasi pengeluaran berdasarkan kategori dan tren bulanan. Laporan keuangan mendalam.",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      icon: Target,
      title: "Manajemen Budget",
      description:
        "Tetapkan anggaran bulanan atau tahunan per kategori. Monitor progress dengan peringatan ketika mendekati limit dan analisis budget vs aktual.",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      icon: Calendar,
      title: "Transaksi Berulang",
      description:
        "Otomatisasi penuh untuk transaksi rutin dengan pengaturan periode yang fleksibel. Hemat waktu dengan penjadwalan otomatis.",
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100",
    },
    {
      icon: Settings,
      title: "Personalisasi Lengkap",
      description:
        "Dukungan multi-currency, tema terang/gelap, multi-bahasa, dan pengaturan format tanggal sesuai preferensi Anda.",
      gradient: "from-gray-500 to-gray-600",
      bgGradient: "from-gray-50 to-gray-100",
    },
    {
      icon: Shield,
      title: "Keamanan & Privasi",
      description:
        "Data Anda tersimpan aman dengan enkripsi tingkat bank. Kontrol penuh terhadap privasi dan keamanan informasi finansial.",
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100",
    },
  ];

  const stats = [
    { number: "100%", label: "Offline Ready", icon: Smartphone },
    { number: "15+", label: "Kategori Default", icon: FileText },
    { number: "5+", label: "Mata Uang", icon: DollarSign },
    { number: "24/7", label: "Akses Data", icon: Globe },
  ];

  return (
    <section
      id="fitur"
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-white to-blue-50"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-50/40 to-transparent rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            Fitur Unggulan
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Semua yang Anda Butuhkan
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              untuk Mengelola Keuangan
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Aplikasi manajemen keuangan personal yang lengkap dengan fitur transaksi, 
            budget tracking, analisis mendalam, dan personalisasi yang dapat disesuaikan dengan kebutuhan Anda.
          </p>
        </div>

        

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 h-full hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200/50 transition-colors duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Highlight */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Fitur Tambahan yang Powerful
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Kategori Kustom</span>
                    <p className="text-gray-600 text-sm">Kelola kategori dengan warna dan ikon yang dapat disesuaikan</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Budget Tracking</span>
                    <p className="text-gray-600 text-sm">Peringatan otomatis ketika mendekati limit anggaran</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Multi-Language</span>
                    <p className="text-gray-600 text-sm">Dukungan bahasa Indonesia dan internasional</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 bg-white rounded-xl p-4">
                  <Moon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-xl p-4">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Multi-Currency</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-xl p-4">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Smart Alerts</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-xl p-4">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 md:mt-20">
          <div className="inline-flex items-center space-x-2 text-blue-600 font-medium">
            <span>Mulai kelola keuangan Anda hari ini</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}