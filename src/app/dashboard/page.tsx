// components/dashboard/Dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TransactionService } from "@/lib/services/transactionService";
import { BudgetService } from "@/lib/services/budgetService";
import { Transaction, TransactionSummary } from "@/types/transaction";
import { BudgetWithSpending } from "@/types/budget";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MoreVertical,
  Target,
  AlertTriangle,
  PieChart,
  ChevronRight,
  Eye,
  Plus,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";

interface CategoryFormData {
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
  is_default: boolean;
}

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  transactionCount: number;
  previousMonthBalance: number;
  balanceChange: number;
  balanceChangePercent: number;
}

interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  activeBudgets: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetWithSpending[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>({
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    activeBudgets: 0,
  });
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    transactionCount: 0,
    previousMonthBalance: 0,
    balanceChange: 0,
    balanceChangePercent: 0,
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get current month dates
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      // Get previous month dates
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .split("T")[0];
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
        .toISOString()
        .split("T")[0];

      // Load recent transactions
      const recentData = await TransactionService.getRecentTransactions(
        user.id,
        8
      );
      setRecentTransactions(recentData);

      // Load current month summary
      const currentSummary = await TransactionService.getTransactionSummary(
        user.id,
        currentMonthStart,
        currentMonthEnd
      );

      // Load previous month summary
      const previousSummary = await TransactionService.getTransactionSummary(
        user.id,
        prevMonthStart,
        prevMonthEnd
      );

      // Load budget data
      const budgetSummaryData = await BudgetService.getBudgetSummary(user.id);
      setBudgetSummary(budgetSummaryData);

      // Load budget alerts
      const alerts = await BudgetService.checkBudgetAlerts(user.id);
      setBudgetAlerts(alerts);

      // Calculate balance change
      const balanceChange =
        currentSummary.net_balance - previousSummary.net_balance;
      const balanceChangePercent =
        previousSummary.net_balance !== 0
          ? (balanceChange / Math.abs(previousSummary.net_balance)) * 100
          : 0;

      setDashboardStats({
        totalBalance: currentSummary.net_balance,
        monthlyIncome: currentSummary.total_income,
        monthlyExpense: currentSummary.total_expense,
        transactionCount: currentSummary.transaction_count,
        previousMonthBalance: previousSummary.net_balance,
        balanceChange,
        balanceChangePercent,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToBudget = () => {
    router.push("/dashboard/budget");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}M`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}Jt`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}rb`;
    }
    return formatCurrency(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateMobile = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    });
  };

  const getTransactionIcon = (type: string) => {
    return type === "income" ? (
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-600" />
    );
  };

  const SummaryCard = ({
    title,
    amount,
    icon: Icon,
    trend,
    trendPercent,
    color = "gray",
  }: {
    title: string;
    amount: number;
    icon: any;
    trend?: "up" | "down" | "neutral";
    trendPercent?: number;
    color?: "gray" | "green" | "red";
  }) => {
    const colorClasses = {
      gray: "bg-white border-gray-200",
      green: "bg-white border-gray-200",
      red: "bg-white border-gray-200",
    };

    const iconColors = {
      gray: "text-gray-600 bg-gray-50",
      green: "text-green-600 bg-green-50",
      red: "text-red-600 bg-red-50",
    };

    return (
      <div
        className={`p-4 sm:p-6 rounded-xl ${colorClasses[color]} border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div
            className={`p-3 sm:p-4 rounded-lg ${iconColors[color]} transition-all duration-300`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          {trend && trendPercent !== undefined && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                trend === "up"
                  ? "text-green-700 bg-green-100"
                  : trend === "down"
                  ? "text-red-700 bg-red-100"
                  : "text-gray-700 bg-gray-100"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : trend === "down" ? (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : null}
              {Math.abs(trendPercent).toFixed(1)}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-xl sm:text-3xl font-bold text-gray-900 leading-none">
            <span className="sm:hidden">{formatCurrencyCompact(amount)}</span>
            <span className="hidden sm:block">{formatCurrency(amount)}</span>
          </p>
        </div>
      </div>
    );
  };

  const BudgetWidget = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-gray-50">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Gambaran Budget
          </h2>
        </div>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      {budgetSummary.activeBudgets > 0 ? (
        <div className="space-y-5 sm:space-y-7">
          {/* Ringkasan Budget */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div className="text-center p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 rounded-lg bg-white flex items-center justify-center">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">
                Total Budget
              </p>
              <p className="text-sm sm:text-lg font-bold text-gray-900">
                <span className="sm:hidden">
                  {formatCurrencyCompact(budgetSummary.totalBudget)}
                </span>
                <span className="hidden sm:block">
                  {formatCurrency(budgetSummary.totalBudget)}
                </span>
              </p>
            </div>
            <div className="text-center p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 rounded-lg bg-white flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">
                Sisa Budget
              </p>
              <p className="text-sm sm:text-lg font-bold text-gray-900">
                <span className="sm:hidden">
                  {formatCurrencyCompact(budgetSummary.totalRemaining)}
                </span>
                <span className="hidden sm:block">
                  {formatCurrency(budgetSummary.totalRemaining)}
                </span>
              </p>
            </div>
          </div>

          {/* Progress Budget */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base font-semibold text-gray-700">
                Total Terpakai
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                {budgetSummary.totalBudget > 0
                  ? (
                      (budgetSummary.totalSpent / budgetSummary.totalBudget) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    budgetSummary.totalBudget > 0 &&
                    budgetSummary.totalSpent / budgetSummary.totalBudget >= 0.8
                      ? "bg-red-500"
                      : budgetSummary.totalBudget > 0 &&
                        budgetSummary.totalSpent / budgetSummary.totalBudget >=
                          0.6
                      ? "bg-orange-500"
                      : "bg-gray-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      budgetSummary.totalBudget > 0
                        ? (budgetSummary.totalSpent /
                            budgetSummary.totalBudget) *
                            100
                        : 0,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Peringatan Budget */}
          {budgetAlerts.length > 0 && (
            <div className="border-t border-gray-200 pt-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-1.5 rounded-lg bg-orange-100">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-orange-700">
                  {budgetAlerts.length} Budget Peringatan
                </span>
              </div>
              <div className="space-y-3">
                {budgetAlerts.slice(0, 3).map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{
                          backgroundColor:
                            budget.categories?.color || "#6B7280",
                        }}
                      ></div>
                      <span className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                        {budget.categories?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full">
                        {budget.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
                {budgetAlerts.length > 3 && (
                  <p className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded-lg">
                    +{budgetAlerts.length - 3} budget lainnya
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Jumlah Budget Aktif */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                {budgetSummary.activeBudgets} budget aktif
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
            <PieChart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-sm sm:text-base text-gray-500 mb-4 font-medium">
            Belum ada budget aktif
          </p>
          <button 
            onClick={handleNavigateToBudget}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Buat Budget Pertama
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen bg-white">
        <div className="animate-pulse max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 h-28 sm:h-36 rounded-xl"
              ></div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="bg-gray-200 h-96 sm:h-[28rem] rounded-xl"></div>
            <div className="bg-gray-200 h-80 sm:h-96 rounded-xl"></div>
            <div className="bg-gray-200 h-72 sm:h-80 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gray-50">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1">
                Dashboard
              </h1>
              <p className="text-sm sm:text-lg text-gray-600 font-medium">
                Ringkasan keuangan Anda bulan ini
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <SummaryCard
            title="Total Saldo"
            amount={dashboardStats.totalBalance}
            icon={Wallet}
            trend={
              dashboardStats.balanceChange > 0
                ? "up"
                : dashboardStats.balanceChange < 0
                ? "down"
                : "neutral"
            }
            trendPercent={dashboardStats.balanceChangePercent}
            color="gray"
          />
          <SummaryCard
            title="Pemasukan"
            amount={dashboardStats.monthlyIncome}
            icon={TrendingUp}
            color="green"
          />
          <SummaryCard
            title="Pengeluaran"
            amount={dashboardStats.monthlyExpense}
            icon={TrendingDown}
            color="red"
          />
          <SummaryCard
            title="Transaksi"
            amount={dashboardStats.transactionCount}
            icon={Calendar}
            color="gray"
          />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-5 sm:mb-7">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gray-50">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Transaksi Terbaru
              </h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 text-sm font-semibold hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300">
              <span className="hidden sm:inline">Lihat Semua</span>
              <Eye className="w-4 h-4 sm:hidden" />
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 border border-gray-200 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                    <div
                      className={`p-3 rounded-lg flex-shrink-0 ${
                        transaction.type === "income"
                          ? "bg-green-100 border border-green-200"
                          : "bg-red-100 border border-red-200"
                      }`}
                    >
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate mb-1">
                        {transaction.description || transaction.category?.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        <span className="sm:hidden">
                          {formatDateMobile(transaction.transaction_date)}
                        </span>
                        <span className="hidden sm:inline flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                            {transaction.category?.name}
                          </span>
                          <span>•</span>
                          <span>
                            {formatDate(transaction.transaction_date)}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p
                      className={`font-bold text-sm sm:text-lg ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      <span className="sm:hidden">
                        {formatCurrencyCompact(Number(transaction.amount))}
                      </span>
                      <span className="hidden sm:inline">
                        {formatCurrency(Number(transaction.amount))}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm sm:text-base font-medium">
                Belum ada transaksi
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-5 sm:mb-7">
            <div className="p-2.5 rounded-lg bg-gray-50">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Statistik Cepat
            </h2>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-semibold text-gray-700">
                  Rasio Pengeluaran
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-full">
                  {dashboardStats.monthlyIncome > 0
                    ? (
                        (dashboardStats.monthlyExpense /
                          dashboardStats.monthlyIncome) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(
                        dashboardStats.monthlyIncome > 0
                          ? (dashboardStats.monthlyExpense /
                              dashboardStats.monthlyIncome) *
                              100
                          : 0,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-gray-700">
                    Rata-rata per Transaksi
                  </span>
                </div>
                <span className="text-sm sm:text-lg font-bold text-gray-900">
                  <span className="sm:hidden">
                    {formatCurrencyCompact(
                      dashboardStats.transactionCount > 0
                        ? (dashboardStats.monthlyIncome +
                            dashboardStats.monthlyExpense) /
                            dashboardStats.transactionCount
                        : 0
                    )}
                  </span>
                  <span className="hidden sm:inline">
                    {formatCurrency(
                      dashboardStats.transactionCount > 0
                        ? (dashboardStats.monthlyIncome +
                            dashboardStats.monthlyExpense) /
                            dashboardStats.transactionCount
                        : 0
                    )}
                  </span>
                </span>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-600 mb-3 font-medium">
                Perbandingan dengan bulan lalu:
              </p>
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                  dashboardStats.balanceChange >= 0
                    ? "text-green-700 bg-green-50 border-green-200"
                    : "text-red-700 bg-red-50 border-red-200"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    dashboardStats.balanceChange >= 0
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {dashboardStats.balanceChange >= 0 ? (
                    <TrendingUp className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-5 h-5 flex-shrink-0" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-bold mb-1">
                    <span className="sm:hidden">
                      {formatCurrencyCompact(
                        Math.abs(dashboardStats.balanceChange)
                      )}
                    </span>
                    <span className="hidden sm:inline">
                      {formatCurrency(Math.abs(dashboardStats.balanceChange))}
                    </span>
                    {dashboardStats.balanceChange >= 0
                      ? " lebih baik"
                      : " lebih buruk"}
                  </p>
                  <p className="text-xs sm:text-sm opacity-80">
                    {dashboardStats.balanceChange >= 0
                      ? "Keuangan Anda meningkat!"
                      : "Perlu evaluasi pengeluaran"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Widget */}
        <BudgetWidget />
      </div>
    </div>
  );
}