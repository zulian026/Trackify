// src/components/home/HeroSection.tsx
"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex  flex-col overflow-hidden"
      style={{ backgroundColor: "#07305B" }}
    >
      {/* Content Container */}
      <div className="relative flex-1 flex flex-col">
        {/* Text Content */}
        <div className="flex-1 flex items-center justify-center px-4 pt-20 md:pt-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight mb-4">
                Kelola Keuangan
                <span className="block bg-gradient-to-r from-blue-300 via-blue-200 to-white bg-clip-text text-transparent animate-pulse">
                  Dengan Mudah
                </span>
              </h1>

              {/* Decorative Line */}
              <div className="flex justify-center mb-6">
                <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full"></div>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xs text-blue-100/90 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4">
              Platform manajemen keuangan terdepan yang membantu Anda melacak
              pengeluaran, mengatur budget, dan mencapai tujuan finansial dengan
              <span className="text-blue-200 font-semibold">
                {" "}
                mudah dan aman
              </span>
              .
            </p>
          </div>
        </div>

        {/* Phone Mockups Container - Show only bottom half */}
        <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
          <div className="absolute -bottom-48 md:-bottom-64 left-1/2 -translate-x-1/2 w-full h-96 md:h-[500px] perspective-1200">
            <div className="relative w-full h-full flex justify-center items-end">
              {/* Phone 1 (Left) */}
              <div className="absolute w-48 sm:w-56 md:w-64 h-96 md:h-[32rem] transform -translate-x-20 sm:-translate-x-24 md:-translate-x-32 -rotate-[20deg] origin-bottom-center transition-transform duration-500 ease-out">
                <div className="w-full h-full p-2 bg-gray-900/90 backdrop-blur-sm border-4 border-gray-700/80 rounded-[40px] shadow-2xl shadow-blue-500/20">
                  <div className="w-full h-full bg-gradient-to-b from-[#0c3c6e] to-[#08294a] rounded-[32px] p-4 flex flex-col space-y-3">
                    {/* Status bar */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="w-8 h-2 bg-blue-300/40 rounded-full"></div>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-300/40 rounded-full"></div>
                        <div className="w-1 h-1 bg-blue-300/40 rounded-full"></div>
                        <div className="w-1 h-1 bg-blue-300/40 rounded-full"></div>
                      </div>
                    </div>
                    {/* Content placeholders */}
                    <div className="w-full h-3 bg-blue-300/30 rounded-md animate-pulse"></div>
                    <div className="w-9/12 h-3 bg-blue-300/30 rounded-md animate-pulse delay-150"></div>
                    <div className="flex-grow w-full bg-blue-400/20 rounded-lg mt-3 p-3">
                      <div className="space-y-2">
                        <div className="w-full h-2 bg-blue-300/20 rounded"></div>
                        <div className="w-8/12 h-2 bg-blue-300/20 rounded"></div>
                        <div className="w-10/12 h-2 bg-blue-300/20 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 2 (Center) */}
              <div className="relative w-56 sm:w-64 md:w-72 h-[28rem] sm:h-[32rem] md:h-[36rem] z-10 transition-transform duration-500 ease-out">
                <div className="w-full h-full p-3 bg-gray-900/90 backdrop-blur-sm border-4 border-gray-600/80 rounded-[48px] shadow-2xl shadow-blue-500/40">
                  <div className="w-full h-full bg-gradient-to-b from-[#0c3c6e] to-[#08294a] rounded-[38px] p-4 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/80 rounded-sm"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-2 bg-blue-300/50 rounded-full animate-pulse"></div>
                        <div className="w-4 h-4 bg-blue-300/30 rounded-full"></div>
                      </div>
                    </div>

                    {/* Balance Card */}
                    <div className="w-full h-24 sm:h-32 md:h-40 bg-gradient-to-r from-blue-500/60 to-blue-400/60 rounded-xl mb-4 flex flex-col justify-center items-center shadow-lg">
                      <span className="text-blue-100/80 text-xs mb-1">
                        Total Saldo
                      </span>
                      <span className="text-white font-bold text-base sm:text-lg md:text-xl">
                        Rp 12.540.000
                      </span>
                      <div className="flex space-x-2 mt-2">
                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                      </div>
                    </div>

                    {/* Transaction List */}
                    <div className="space-y-3 flex-grow">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-400/30 rounded-full"></div>
                        <div className="flex-1">
                          <div className="w-full h-3 bg-blue-300/50 rounded-md animate-pulse delay-200"></div>
                          <div className="w-8/12 h-2 bg-blue-300/30 rounded-md animate-pulse delay-300 mt-1"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-400/30 rounded-full"></div>
                        <div className="flex-1">
                          <div className="w-10/12 h-3 bg-blue-300/50 rounded-md animate-pulse delay-400"></div>
                          <div className="w-6/12 h-2 bg-blue-300/30 rounded-md animate-pulse delay-500 mt-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 3 (Right) */}
              <div className="absolute w-48 sm:w-56 md:w-64 h-96 md:h-[32rem] transform translate-x-20 sm:translate-x-24 md:translate-x-32 rotate-[20deg] origin-bottom-center transition-transform duration-500 ease-out">
                <div className="w-full h-full p-2 bg-gray-900/90 backdrop-blur-sm border-4 border-gray-700/80 rounded-[40px] shadow-2xl shadow-blue-500/20">
                  <div className="w-full h-full bg-gradient-to-b from-[#0c3c6e] to-[#08294a] rounded-[32px] p-4 flex flex-col space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="w-6 h-6 bg-blue-400/40 rounded-full"></div>
                      <div className="w-16 h-2 bg-blue-300/30 rounded-full"></div>
                    </div>

                    {/* Chart placeholder */}
                    <div className="w-full h-16 bg-blue-400/20 rounded-lg flex items-end justify-around p-2">
                      <div className="w-2 h-6 bg-blue-300/40 rounded-t"></div>
                      <div className="w-2 h-10 bg-blue-400/50 rounded-t"></div>
                      <div className="w-2 h-4 bg-blue-300/40 rounded-t"></div>
                      <div className="w-2 h-8 bg-blue-400/50 rounded-t"></div>
                    </div>

                    <div className="w-9/12 h-3 bg-blue-300/30 rounded-md animate-pulse delay-150"></div>
                    <div className="w-full h-3 bg-blue-300/30 rounded-md animate-pulse delay-300"></div>
                    <div className="flex-grow w-full bg-blue-400/20 rounded-lg mt-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
