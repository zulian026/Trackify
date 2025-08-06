// src/components/ContactSection.js
export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Hubungi <span className="text-green-600">Kami</span>
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
          Punya pertanyaan atau butuh bantuan? Kami siap membantu. Kirimkan pesan melalui formulir di bawah ini.
        </p>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <textarea
            rows="5"
            placeholder="Pesan kamu..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
          >
            Kirim Pesan
          </button>
        </form>
      </div>
    </section>
  );
}
