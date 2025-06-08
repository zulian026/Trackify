  // lib/services/categoryService.ts
  import { supabase } from "@/lib/supabase";
  import { Category } from "@/types/transaction";

  export class CategoryService {
    // Mengambil semua kategori milik pengguna
    static async getCategories(userId: string): Promise<Category[]> {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .order("name");

      if (error) {
        throw new Error(`Gagal mengambil kategori: ${error.message}`);
      }

      return data || [];
    }

    // Mengambil kategori berdasarkan tipe
    static async getCategoriesByType(
      userId: string,
      type: "income" | "expense"
    ): Promise<Category[]> {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .eq("type", type)
        .order("name");

      if (error) {
        throw new Error(`Gagal mengambil kategori: ${error.message}`);
      }

      return data || [];
    }

    // Membuat kategori default untuk pengguna baru
    static async createDefaultCategories(userId: string): Promise<void> {
      const { data: existingCategories } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", userId)
        .limit(1);

      // Jika sudah ada kategori, tidak perlu membuat lagi
      if (existingCategories && existingCategories.length > 0) return;

      const defaultCategories = [
        // Kategori Pemasukan
        {
          name: "Gaji",
          type: "income",
          color: "#10B981",
          icon: "banknote",
          is_default: true,
        },
        {
          name: "Freelance",
          type: "income",
          color: "#3B82F6",
          icon: "laptop",
          is_default: true,
        },
        {
          name: "Investasi",
          type: "income",
          color: "#8B5CF6",
          icon: "trending-up",
          is_default: true,
        },
        {
          name: "Hadiah",
          type: "income",
          color: "#F59E0B",
          icon: "gift",
          is_default: true,
        },

        // Kategori Pengeluaran
        {
          name: "Makanan & Minuman",
          type: "expense",
          color: "#EF4444",
          icon: "utensils",
          is_default: true,
        },
        {
          name: "Transportasi",
          type: "expense",
          color: "#F97316",
          icon: "car",
          is_default: true,
        },
        {
          name: "Belanja",
          type: "expense",
          color: "#EC4899",
          icon: "shopping-bag",
          is_default: true,
        },
        {
          name: "Hiburan",
          type: "expense",
          color: "#8B5CF6",
          icon: "gamepad-2",
          is_default: true,
        },
        {
          name: "Tagihan & Utilitas",
          type: "expense",
          color: "#6B7280",
          icon: "receipt",
          is_default: true,
        },
        {
          name: "Kesehatan",
          type: "expense",
          color: "#DC2626",
          icon: "heart-pulse",
          is_default: true,
        },
        {
          name: "Pendidikan",
          type: "expense",
          color: "#2563EB",
          icon: "graduation-cap",
          is_default: true,
        },
        {
          name: "Lainnya",
          type: "expense",
          color: "#6B7280",
          icon: "more-horizontal",
          is_default: true,
        },
      ];

      const categoriesToInsert = defaultCategories.map((category) => ({
        ...category,
        user_id: userId,
      }));

      const { error } = await supabase
        .from("categories")
        .insert(categoriesToInsert);

      if (error) {
        throw new Error(
          `Gagal membuat kategori default: ${error.message}`
        );
      }
    }

    // Membuat kategori baru
    static async createCategory(
      userId: string,
      categoryData: Omit<Category, "id" | "user_id" | "created_at" | "updated_at">
    ): Promise<Category> {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          user_id: userId,
          ...categoryData,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Gagal membuat kategori: ${error.message}`);
      }

      return data;
    }

    // Memperbarui kategori
    static async updateCategory(
      userId: string,
      categoryId: string,
      categoryData: Partial<
        Omit<Category, "id" | "user_id" | "created_at" | "updated_at">
      >
    ): Promise<Category> {
      const { data, error } = await supabase
        .from("categories")
        .update({
          ...categoryData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", categoryId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Gagal memperbarui kategori: ${error.message}`);
      }

      return data;
    }

    // Menghapus kategori
    static async deleteCategory(
      userId: string,
      categoryId: string
    ): Promise<void> {
      // Cek apakah kategori sedang digunakan dalam transaksi
      const { data: transactions, error: checkError } = await supabase
        .from("transactions")
        .select("id")
        .eq("category_id", categoryId)
        .limit(1);

      if (checkError) {
        throw new Error(`Gagal memeriksa penggunaan kategori: ${checkError.message}`);
      }

      if (transactions && transactions.length > 0) {
        throw new Error(
          "Tidak dapat menghapus kategori yang sedang digunakan oleh transaksi"
        );
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("user_id", userId);

      if (error) {
        throw new Error(`Gagal menghapus kategori: ${error.message}`);
      }
    }
  }
