// lib/services/budgetService.ts
import { supabase } from "@/lib/supabase";
import { Budget, BudgetWithSpending, CreateBudgetData } from "@/types/budget";

export class BudgetService {
  // Mengambil semua budget milik pengguna
  static async getBudgets(userId: string): Promise<Budget[]> {
    const { data, error } = await supabase
      .from("budgets")
      .select(
        `*,
        categories (
          id,
          name,
          color,
          icon,
          type
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Gagal mengambil budget: ${error.message}`);
    }

    return data || [];
  }

  // Mengambil budget aktif
  static async getActiveBudgets(userId: string): Promise<Budget[]> {
    const { data, error } = await supabase
      .from("budgets")
      .select(
        `*,
        categories (
          id,
          name,
          color,
          icon,
          type
        )
      `
      )
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Gagal mengambil budget aktif: ${error.message}`);
    }

    return data || [];
  }

  // Ambil budget dengan spending
  static async getBudgetsWithSpending(
    userId: string
  ): Promise<BudgetWithSpending[]> {
    const budgets = await this.getBudgets(userId);

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await this.getBudgetSpending(
          userId,
          budget.category_id,
          budget.start_date,
          budget.end_date
        );
        const remaining = Math.max(0, budget.amount - spent);
        const percentage =
          budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        return {
          ...budget,
          spent,
          remaining,
          percentage,
        };
      })
    );

    return budgetsWithSpending;
  }

  // Membuat budget baru
  static async createBudget(
    userId: string,
    budgetData: CreateBudgetData
  ): Promise<Budget> {
    const { data, error } = await supabase
      .from("budgets")
      .insert({
        user_id: userId,
        ...budgetData,
      })
      .select(
        `*,
        categories (
          id,
          name,
          color,
          icon,
          type
        )
      `
      )
      .single();

    if (error) {
      throw new Error(`Gagal membuat budget: ${error.message}`);
    }

    return data;
  }

  // Memperbarui budget
  static async updateBudget(
    userId: string,
    budgetId: string,
    budgetData: Partial<CreateBudgetData>
  ): Promise<Budget> {
    const { data, error } = await supabase
      .from("budgets")
      .update({
        ...budgetData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", budgetId)
      .eq("user_id", userId)
      .select(
        `*,
        categories (
          id,
          name,
          color,
          icon,
          type
        )
      `
      )
      .single();

    if (error) {
      throw new Error(`Gagal memperbarui budget: ${error.message}`);
    }

    return data;
  }

  // Menghapus budget
  static async deleteBudget(userId: string, budgetId: string): Promise<void> {
    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", budgetId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Gagal menghapus budget: ${error.message}`);
    }
  }

  // Mengambil total pengeluaran untuk budget tertentu
  static async getBudgetSpending(
    userId: string,
    categoryId: string,
    startDate: string,
    endDate: string
  ): Promise<number> {
    const { data, error } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .eq("type", "expense")
      .gte("transaction_date", startDate)
      .lte("transaction_date", endDate);

    if (error) {
      throw new Error(`Gagal mengambil pengeluaran budget: ${error.message}`);
    }

    return (
      data?.reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      ) || 0
    );
  }

  // Toggle status aktif budget
  static async toggleBudgetStatus(
    userId: string,
    budgetId: string,
    isActive: boolean
  ): Promise<Budget> {
    const { data, error } = await supabase
      .from("budgets")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", budgetId)
      .eq("user_id", userId)
      .select(
        `*,
        categories (
          id,
          name,
          color,
          icon,
          type
        )
      `
      )
      .single();

    if (error) {
      throw new Error(`Gagal mengubah status budget: ${error.message}`);
    }

    return data;
  }

  // Cek budget yang hampir habis atau sudah terlampaui
  static async checkBudgetAlerts(
    userId: string
  ): Promise<BudgetWithSpending[]> {
    const budgets = await this.getBudgetsWithSpending(userId);

    // Filter budget yang perlu peringatan (>= 80% atau sudah terlampaui)
    return budgets.filter(
      (budget) => budget.is_active && budget.percentage >= 80
    );
  }

  // Ambil budget berdasarkan kategori dan periode
  static async getBudgetByCategory(
    userId: string,
    categoryId: string,
    date: string
  ): Promise<Budget | null> {
    try {
      const { data, error } = await supabase
        .from("budgets")
        .select(
          `*,
          categories (
            id,
            name,
            color,
            icon,
            type
          )
        `
        )
        .eq("user_id", userId)
        .eq("category_id", categoryId)
        .lte("start_date", date)
        .gte("end_date", date)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Error fetching budget by category:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching budget by category:", error);
      return null;
    }
  }

  // Ambil ringkasan budget (total budget, total spent, dll)
  static async getBudgetSummary(userId: string): Promise<{
    totalBudget: number;
    totalSpent: number;
    totalRemaining: number;
    activeBudgets: number;
  }> {
    try {
      const budgets = await this.getBudgetsWithSpending(userId);
      const activeBudgets = budgets.filter((b) => b.is_active);

      const totalBudget = activeBudgets.reduce((sum, b) => sum + b.amount, 0);
      const totalSpent = activeBudgets.reduce((sum, b) => sum + b.spent, 0);
      const totalRemaining = activeBudgets.reduce(
        (sum, b) => sum + b.remaining,
        0
      );

      return {
        totalBudget,
        totalSpent,
        totalRemaining,
        activeBudgets: activeBudgets.length,
      };
    } catch (error) {
      console.error("Error fetching budget summary:", error);
      return {
        totalBudget: 0,
        totalSpent: 0,
        totalRemaining: 0,
        activeBudgets: 0,
      };
    }
  }
}
