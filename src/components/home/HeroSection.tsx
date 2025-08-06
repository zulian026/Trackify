// src/components/HeroSection.js
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="pt-24 lg:pt-36 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Triangles */}
        <div
          className="absolute top-20 left-10 w-16 h-16 bg-green-300 opacity-20 blur-sm transform rotate-45"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-12 h-12 bg-blue-400 opacity-25 blur-sm transform rotate-12"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-20 h-20 bg-yellow-300 opacity-15 blur-md transform -rotate-12"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>

        {/* Circles */}
        <div className="absolute top-32 right-40 w-24 h-24 bg-purple-300 opacity-20 rounded-full blur-md"></div>
        <div className="absolute bottom-60 right-10 w-16 h-16 bg-pink-300 opacity-25 rounded-full blur-sm"></div>
        <div className="absolute top-60 left-40 w-32 h-32 bg-indigo-200 opacity-15 rounded-full blur-lg"></div>

        {/* City Silhouette Elements */}
        <div className="absolute bottom-0 left-0 right-0 opacity-10">
          {/* Building shapes */}
          <div className="absolute bottom-0 left-1/4 w-8 h-20 bg-gray-600 blur-sm"></div>
          <div className="absolute bottom-0 left-1/3 w-12 h-32 bg-gray-700 blur-sm"></div>
          <div className="absolute bottom-0 left-2/5 w-6 h-16 bg-gray-600 blur-sm"></div>
          <div className="absolute bottom-0 left-1/2 w-10 h-28 bg-gray-800 blur-sm"></div>
          <div className="absolute bottom-0 left-3/5 w-14 h-24 bg-gray-600 blur-sm"></div>
          <div className="absolute bottom-0 left-2/3 w-8 h-36 bg-gray-700 blur-sm"></div>
          <div className="absolute bottom-0 left-3/4 w-12 h-20 bg-gray-600 blur-sm"></div>
        </div>

        {/* Abstract Shapes */}
        <div className="absolute top-16 left-1/3 w-28 h-28 bg-green-200 opacity-20 blur-xl transform rotate-45 rounded-lg"></div>
        <div className="absolute bottom-32 right-1/3 w-36 h-36 bg-blue-200 opacity-15 blur-2xl transform -rotate-12 rounded-full"></div>

        {/* Hexagons */}
        <div
          className="absolute top-52 right-60 w-14 h-14 bg-teal-300 opacity-25 blur-sm transform rotate-30"
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
          }}
        ></div>
        <div
          className="absolute bottom-80 left-60 w-10 h-10 bg-orange-300 opacity-30 blur-sm transform -rotate-45"
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
          }}
        ></div>

        {/* Floating Lines */}
        <div className="absolute top-44 left-16 w-32 h-1 bg-green-400 opacity-20 blur-sm transform rotate-12"></div>
        <div className="absolute bottom-52 right-24 w-24 h-1 bg-blue-400 opacity-25 blur-sm transform -rotate-45"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-72 right-16 w-40 h-40 bg-gradient-to-r from-green-200 to-blue-200 opacity-20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-16 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 opacity-25 rounded-full blur-xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="border border-green-600 p-1 w-fit mx-auto rounded-full flex items-center gap-2 mb-4 px-4 bg-white/80 backdrop-blur-sm">
          <span className="text-xs font-medium text-gray-900">
            Aplikasi manajemen keuangan personal
          </span>
          <a
            href="https://trackify-ten.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full flex justify-center items-center bg-green-600 hover:bg-green-700 transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.83398 8.00019L12.9081 8.00019M9.75991 11.778L13.0925 8.44541C13.3023 8.23553 13.4073 8.13059 13.4073 8.00019C13.4073 7.86979 13.3023 7.76485 13.0925 7.55497L9.75991 4.22241"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Heading */}
        <h1 className="max-w-3xl mx-auto font-bold text-4xl md:text-5xl text-gray-900 leading-tight mb-6">
          Trackify 💰 — Kelola Keuangan Anda{" "}
          <span className="text-green-600">Dengan Cerdas</span>
        </h1>

        {/* Deskripsi */}
        <p className="max-w-xl mx-auto text-gray-600 text-base leading-7 mb-10">
          Catat, pantau, dan analisis pemasukan serta pengeluaran Anda dengan
          mudah melalui dashboard, grafik interaktif, dan sistem anggaran
          otomatis.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href="/login"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 text-white bg-green-600 hover:bg-green-700 text-base font-semibold rounded-full transition shadow-lg hover:shadow-xl"
          >
            Coba Sekarang
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Gambar Ilustrasi */}
        <div className="flex justify-center mt-12">
          <img
            src="/page.png"
            alt="Trackify Dashboard"
            className="w-full max-w-xl drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
