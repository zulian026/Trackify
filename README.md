# Trackify 💰

Aplikasi manajemen keuangan personal yang membantu Anda mencatat, memantau, dan menganalisis pemasukan serta pengeluaran dengan mudah dan efisien.

## 🚀 Fitur Utama

### 📝 Manajemen Transaksi
- **Input Transaksi**: Catat pemasukan dan pengeluaran dengan kategori, tanggal, dan deskripsi
- **Transaksi Berulang**: Otomatisasi untuk transaksi rutin (harian, mingguan, bulanan, tahunan)
- **Kategori Kustom**: Kelola kategori dengan warna dan ikon yang dapat disesuaikan

### 📊 Analisis & Visualisasi
- **Dashboard Ringkasan**: Lihat saldo, total pemasukan, dan pengeluaran per periode
- **Grafik Interaktif**: Visualisasi pengeluaran berdasarkan kategori dan tren bulanan
- **Laporan Keuangan**: Analisis mendalam terhadap pola pengeluaran Anda

### 💼 Manajemen Budget
- **Budget Planning**: Tetapkan anggaran bulanan atau tahunan per kategori
- **Budget Tracking**: Monitor progress dan peringatan ketika mendekati limit
- **Budget Analytics**: Perbandingan budget vs aktual pengeluaran

### ⚙️ Personalisasi
- **Multi-Currency**: Dukungan berbagai mata uang (default: IDR)
- **Theme Options**: Mode terang dan gelap
- **Multi-Language**: Dukungan bahasa Indonesia dan lainnya
- **Custom Preferences**: Atur format tanggal dan notifikasi sesuai kebutuhan

## 🛠️ Tech Stack

- **Backend**: PostgreSQL Database
- **Authentication**: User authentication system
- **Database**: UUID-based schema dengan foreign key constraints
- **Features**: 
  - Transaction management
  - Category management
  - Recurring transactions
  - Budget planning
  - User preferences

## 📋 Database Schema

### Tables Overview
- `users` - Data pengguna dan autentikasi
- `categories` - Kategori pemasukan dan pengeluaran
- `transactions` - Record transaksi keuangan
- `recurring_transactions` - Transaksi berulang otomatis
- `budgets` - Perencanaan anggaran
- `user_preferences` - Pengaturan personal pengguna

## 🚀 Getting Started

### Prerequisites
- PostgreSQL 12+
- Node.js 16+ (jika menggunakan backend Node.js)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/username/trackify.git
   cd trackify
   ```

2. **Setup Database**
   ```bash
   # Buat database baru
   createdb trackify_db
   
   # Import schema
   psql trackify_db < schema.sql
   ```

3. **Environment Setup**
   ```bash
   # Copy environment variables
   cp .env.example .env
   
   # Edit konfigurasi database
   nano .env
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Run Application**
   ```bash
   npm start
   ```

## 📱 Usage

### Input Transaksi
```
1. Pilih jenis: Pemasukan atau Pengeluaran
2. Masukkan jumlah dan pilih kategori
3. Tambahkan deskripsi (opsional)
4. Simpan transaksi
```

### Manajemen Kategori
```
1. Akses menu Kategori
2. Tambah kategori baru dengan nama, warna, dan ikon
3. Edit atau hapus kategori yang ada
4. Atur kategori default untuk kemudahan input
```

### Setup Budget
```
1. Buka menu Budget
2. Pilih kategori dan periode (bulanan/tahunan)
3. Tetapkan jumlah anggaran
4. Aktifkan monitoring otomatis
```

## 🔧 Configuration

### Database Configuration
```sql
-- Contoh konfigurasi default categories
INSERT INTO categories (name, type, color, icon, is_default) VALUES
('Makanan', 'expense', '#EF4444', 'utensils', true),
('Transport', 'expense', '#3B82F6', 'car', true),
('Gaji', 'income', '#10B981', 'dollar-sign', true);
```

### User Preferences
- **Currency**: IDR (default), USD, EUR, dll
- **Date Format**: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
- **Theme**: Light/Dark mode
- **Language**: Indonesian (default), English
- **Notifications**: Enable/Disable budget alerts

## 📊 Features Detail

### Recurring Transactions
- Otomatisasi transaksi berulang
- Frequency: daily, weekly, monthly, yearly
- Auto-generate berdasarkan jadwal
- Manajemen start/end date

### Budget Management
- Set budget per kategori
- Period-based budgeting (monthly/yearly)
- Active/inactive budget tracking
- Budget vs actual comparison

### Data Visualization
- Chart pengeluaran per kategori
- Trend analysis bulanan
- Income vs expense comparison
- Category-wise spending patterns

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/username/trackify](https://github.com/username/trackify)

## 🙏 Acknowledgments

- Terima kasih kepada semua kontributor
- Inspirasi dari berbagai aplikasi manajemen keuangan
- Community support dan feedback

---

**Trackify** - Kelola keuangan Anda dengan mudah dan cerdas! 💰✨