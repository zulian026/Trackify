// lib/services/reportService.ts
import { supabase } from "@/lib/supabase";
import { TransactionService } from "./transactionService";
import { BudgetService } from "./budgetService";

export interface MonthlyReport {
  month: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

export interface CategoryReport {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface DailySpending {
  date: string;
  amount: number;
  transactionCount: number;
}

export interface YearlyComparison {
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  monthlyAverage: number;
}

export interface BudgetPerformance {
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  remaining: number;
  percentage: number;
  status: "safe" | "warning" | "exceeded";
}

export class ReportService {
  // Laporan bulanan
  static async getMonthlyReport(
    userId: string,
    year: number,
    month?: number
  ): Promise<MonthlyReport[]> {
    let query = supabase
      .from("transactions")
      .select("amount, type, transaction_date")
      .eq("user_id", userId);

    if (month) {
      const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
      const endDate = new Date(year, month, 0).toISOString().split("T")[0];
      query = query
        .gte("transaction_date", startDate)
        .lte("transaction_date", endDate);
    } else {
      query = query
        .gte("transaction_date", `${year}-01-01`)
        .lte("transaction_date", `${year}-12-31`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Gagal mengambil laporan bulanan: ${error.message}`);
    }

    // Grup data berdasarkan bulan
    const monthlyData = (data || []).reduce(
      (acc: Record<string, any>, transaction) => {
        const date = new Date(transaction.transaction_date);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;

        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: date.toLocaleDateString("id-ID", { month: "long" }),
            year: date.getFullYear(),
            totalIncome: 0,
            totalExpense: 0,
            netBalance: 0,
            transactionCount: 0,
          };
        }

        const amount = Number(transaction.amount);
        if (transaction.type === "income") {
          acc[monthKey].totalIncome += amount;
        } else {
          acc[monthKey].totalExpense += amount;
        }
        acc[monthKey].transactionCount++;

        return acc;
      },
      {}
    );

    // Hitung net balance dan convert ke array
    return Object.values(monthlyData).map((data: any) => ({
      ...data,
      netBalance: data.totalIncome - data.totalExpense,
    }));
  }

  // Laporan kategori
  static async getCategoryReport(
    userId: string,
    type: "income" | "expense" | "all" = "all",
    startDate?: string,
    endDate?: string
  ): Promise<CategoryReport[]> {
    let query = supabase
      .from("transactions")
      .select(
        `
        amount,
        type,
        categories!inner (
          id,
          name,
          color,
          icon
        )
      `
      )
      .eq("user_id", userId);

    if (type !== "all") {
      query = query.eq("type", type);
    }

    if (startDate) {
      query = query.gte("transaction_date", startDate);
    }

    if (endDate) {
      query = query.lte("transaction_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Gagal mengambil laporan kategori: ${error.message}`);
    }

    // Grup data berdasarkan kategori
    const categoryData = (data || []).reduce(
      (acc: Record<string, any>, transaction: any) => {
        const category = transaction.categories;
        if (!category) return acc;

        const key = category.id;
        if (!acc[key]) {
          acc[key] = {
            categoryId: category.id,
            categoryName: category.name,
            categoryColor: category.color,
            categoryIcon: category.icon,
            totalAmount: 0,
            transactionCount: 0,
            percentage: 0,
          };
        }

        acc[key].totalAmount += Number(transaction.amount);
        acc[key].transactionCount++;

        return acc;
      },
      {}
    );

    const categoryReports = Object.values(categoryData) as CategoryReport[];
    const totalAmount = categoryReports.reduce(
      (sum, cat) => sum + cat.totalAmount,
      0
    );

    // Hitung persentase
    return categoryReports
      .map((cat) => ({
        ...cat,
        percentage: totalAmount > 0 ? (cat.totalAmount / totalAmount) * 100 : 0,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }

  // Laporan pengeluaran harian
  static async getDailySpendingReport(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<DailySpending[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("amount, transaction_date")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("transaction_date", startDate)
      .lte("transaction_date", endDate)
      .order("transaction_date");

    if (error) {
      throw new Error(`Gagal mengambil laporan harian: ${error.message}`);
    }

    // Grup data berdasarkan tanggal
    const dailyData = (data || []).reduce(
      (acc: Record<string, any>, transaction) => {
        const date = transaction.transaction_date;

        if (!acc[date]) {
          acc[date] = {
            date,
            amount: 0,
            transactionCount: 0,
          };
        }

        acc[date].amount += Number(transaction.amount);
        acc[date].transactionCount++;

        return acc;
      },
      {}
    );

    return Object.values(dailyData).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // Perbandingan tahunan
  static async getYearlyComparison(
    userId: string,
    years: number[] = []
  ): Promise<YearlyComparison[]> {
    if (years.length === 0) {
      // Ambil 3 tahun terakhir sebagai default
      const currentYear = new Date().getFullYear();
      years = [currentYear - 2, currentYear - 1, currentYear];
    }

    const yearlyReports = await Promise.all(
      years.map(async (year) => {
        const { data, error } = await supabase
          .from("transactions")
          .select("amount, type")
          .eq("user_id", userId)
          .gte("transaction_date", `${year}-01-01`)
          .lte("transaction_date", `${year}-12-31`);

        if (error) {
          throw new Error(
            `Gagal mengambil data tahun ${year}: ${error.message}`
          );
        }

        const yearData = (data || []).reduce(
          (acc, transaction) => {
            const amount = Number(transaction.amount);
            if (transaction.type === "income") {
              acc.totalIncome += amount;
            } else {
              acc.totalExpense += amount;
            }
            return acc;
          },
          { totalIncome: 0, totalExpense: 0 }
        );

        return {
          year,
          totalIncome: yearData.totalIncome,
          totalExpense: yearData.totalExpense,
          netBalance: yearData.totalIncome - yearData.totalExpense,
          monthlyAverage: (yearData.totalIncome - yearData.totalExpense) / 12,
        };
      })
    );

    return yearlyReports.sort((a, b) => a.year - b.year);
  }

  // Performa budget
  static async getBudgetPerformance(
    userId: string,
    month?: number,
    year?: number
  ): Promise<BudgetPerformance[]> {
    try {
      const budgets = await BudgetService.getBudgetsWithSpending(userId);

      return budgets
        .filter((budget) => budget.is_active)
        .map((budget) => {
          const percentage = budget.percentage;
          let status: "safe" | "warning" | "exceeded" = "safe";

          if (percentage >= 100) {
            status = "exceeded";
          } else if (percentage >= 80) {
            status = "warning";
          }

          return {
            categoryName: budget.categories?.name || "Unknown",
            budgetAmount: budget.amount,
            spentAmount: budget.spent,
            remaining: budget.remaining,
            percentage,
            status,
          };
        })
        .sort((a, b) => b.percentage - a.percentage);
    } catch (error) {
      throw new Error(`Gagal mengambil performa budget: ${error}`);
    }
  }

  // Tren bulanan (untuk grafik)
  static async getMonthlyTrend(
    userId: string,
    months: number = 12
  ): Promise<{
    labels: string[];
    income: number[];
    expense: number[];
    netBalance: number[];
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months + 1);
    startDate.setDate(1);

    const { data, error } = await supabase
      .from("transactions")
      .select("amount, type, transaction_date")
      .eq("user_id", userId)
      .gte("transaction_date", startDate.toISOString().split("T")[0])
      .lte("transaction_date", endDate.toISOString().split("T")[0]);

    if (error) {
      throw new Error(`Gagal mengambil tren bulanan: ${error.message}`);
    }

    // Generate labels untuk semua bulan
    const labels: string[] = [];
    const monthlyData: Record<string, { income: number; expense: number }> = {};

    for (let i = 0; i < months; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const label = date.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      });

      labels.push(label);
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    // Isi data transaksi
    (data || []).forEach((transaction) => {
      const date = new Date(transaction.transaction_date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (monthlyData[monthKey]) {
        const amount = Number(transaction.amount);
        if (transaction.type === "income") {
          monthlyData[monthKey].income += amount;
        } else {
          monthlyData[monthKey].expense += amount;
        }
      }
    });

    const income = Object.values(monthlyData).map((data) => data.income);
    const expense = Object.values(monthlyData).map((data) => data.expense);
    const netBalance = income.map((inc, idx) => inc - expense[idx]);

    return { labels, income, expense, netBalance };
  }

  // Ringkasan keuangan
  static async getFinancialSummary(
    userId: string,
    period: "this_month" | "last_month" | "this_year" | "custom" = "this_month",
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    transactionCount: number;
    avgDailySpending: number;
    topCategory: { name: string; amount: number } | null;
    budgetUtilization: number;
  }> {
    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case "this_month":
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        dateFilter = {
          startDate: thisMonthStart.toISOString().split("T")[0],
          endDate: thisMonthEnd.toISOString().split("T")[0],
        };
        break;
      case "last_month":
        const lastMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        dateFilter = {
          startDate: lastMonthStart.toISOString().split("T")[0],
          endDate: lastMonthEnd.toISOString().split("T")[0],
        };
        break;
      case "this_year":
        dateFilter = {
          startDate: `${now.getFullYear()}-01-01`,
          endDate: `${now.getFullYear()}-12-31`,
        };
        break;
      case "custom":
        dateFilter = { startDate, endDate };
        break;
    }

    // Ambil summary dasar
    const summary = await TransactionService.getTransactionSummary(
      userId,
      (dateFilter as any).startDate,
      (dateFilter as any).endDate
    );

    // Ambil kategori teratas
    const categoryReport = await this.getCategoryReport(
      userId,
      "expense",
      (dateFilter as any).startDate,
      (dateFilter as any).endDate
    );

    const topCategory =
      categoryReport.length > 0
        ? {
            name: categoryReport[0].categoryName,
            amount: categoryReport[0].totalAmount,
          }
        : null;

    // Hitung rata-rata pengeluaran harian
    const daysDiff =
      (dateFilter as any).startDate && (dateFilter as any).endDate
        ? Math.ceil(
            (new Date((dateFilter as any).endDate).getTime() -
              new Date((dateFilter as any).startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        : 30;

    const avgDailySpending = summary.total_expense / daysDiff;

    // Ambil budget utilization
    const budgetPerformance = await this.getBudgetPerformance(userId);
    const avgBudgetUtilization =
      budgetPerformance.length > 0
        ? budgetPerformance.reduce(
            (sum, budget) => sum + budget.percentage,
            0
          ) / budgetPerformance.length
        : 0;

    return {
      totalIncome: summary.total_income,
      totalExpense: summary.total_expense,
      netBalance: summary.net_balance,
      transactionCount: summary.transaction_count,
      avgDailySpending,
      topCategory,
      budgetUtilization: avgBudgetUtilization,
    };
  }
}
