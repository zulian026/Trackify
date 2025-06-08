// components/dashboard/Dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
    color = "blue",
  }: {
    title: string;
    amount: number;
    icon: any;
    trend?: "up" | "down" | "neutral";
    trendPercent?: number;
    color?: "blue" | "green" | "red" | "purple";
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      green: "bg-green-50 border-green-200 text-green-700",
      red: "bg-red-50 border-red-200 text-red-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
    };

    const iconColors = {
      blue: "text-blue-600",
      green: "text-green-600",
      red: "text-red-600",
      purple: "text-purple-600",
    };

    return (
      <div
        className={`p-4 sm:p-6 rounded-xl border-2 ${colorClasses[color]} transition-all hover:shadow-lg`}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={`p-2 sm:p-3 rounded-lg bg-white/60 ${iconColors[color]}`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          {trend && trendPercent !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                  ? "text-red-600"
                  : "text-gray-600"
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
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">
            <span className="sm:hidden">{formatCurrencyCompact(amount)}</span>
            <span className="hidden sm:block">{formatCurrency(amount)}</span>
          </p>
        </div>
      </div>
    );
  };

  const BudgetWidget = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Gambaran Budget</h2>
        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
      </div>

      {budgetSummary.activeBudgets > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Ringkasan Budget */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Budget</p>
              <p className="text-sm sm:text-lg font-bold text-blue-600">
                <span className="sm:hidden">{formatCurrencyCompact(budgetSummary.totalBudget)}</span>
                <span className="hidden sm:block">{formatCurrency(budgetSummary.totalBudget)}</span>
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Sisa Budget</p>
              <p className="text-sm sm:text-lg font-bold text-green-600">
                <span className="sm:hidden">{formatCurrencyCompact(budgetSummary.totalRemaining)}</span>
                <span className="hidden sm:block">{formatCurrency(budgetSummary.totalRemaining)}</span>
              </p>
            </div>
          </div>

          {/* Progress Budget */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Total Terpakai
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {budgetSummary.totalBudget > 0
                  ? (
                      (budgetSummary.totalSpent / budgetSummary.totalBudget) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div
                className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                  budgetSummary.totalBudget > 0 &&
                  budgetSummary.totalSpent / budgetSummary.totalBudget >= 0.8
                    ? "bg-red-500"
                    : budgetSummary.totalBudget > 0 &&
                      budgetSummary.totalSpent / budgetSummary.totalBudget >=
                        0.6
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
                style={{
                  width: `${Math.min(
                    budgetSummary.totalBudget > 0
                      ? (budgetSummary.totalSpent / budgetSummary.totalBudget) *
                          100
                      : 0,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Peringatan Budget */}
          {budgetAlerts.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-xs sm:text-sm font-medium text-orange-600">
                  {budgetAlerts.length} Budget Peringatan
                </span>
              </div>
              <div className="space-y-2">
                {budgetAlerts.slice(0, 3).map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between p-2 bg-orange-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            budget.categories?.color || "#6B7280",
                        }}
                      ></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {budget.categories?.name}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-orange-600">
                      {budget.percentage.toFixed(0)}%
                    </span>
                  </div>
                ))}
                {budgetAlerts.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{budgetAlerts.length - 3} lainnya
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Jumlah Budget Aktif */}
          <div className="text-center text-xs sm:text-sm text-gray-600">
            {budgetSummary.activeBudgets} budget aktif
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <PieChart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-500 mb-2">Belum ada budget aktif</p>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            Buat Budget Pertama
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 sm:h-32 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-200 h-80 sm:h-96 rounded-xl"></div>
            <div className="bg-gray-200 h-64 sm:h-80 rounded-xl"></div>
            <div className="bg-gray-200 h-64 sm:h-80 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Ringkasan keuangan Anda bulan ini</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
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
          color="blue"
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
          color="purple"
        />
      </div>

      {/* Recent Transactions - Mobile First */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Transaksi Terbaru
          </h2>
          <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700">
            <span className="hidden sm:inline">Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {transaction.description || transaction.category?.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      <span className="sm:hidden">{formatDateMobile(transaction.transaction_date)}</span>
                      <span className="hidden sm:inline">
                        {transaction.category?.name} • {formatDate(transaction.transaction_date)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p
                    className={`font-semibold text-sm sm:text-base ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    <span className="sm:hidden">{formatCurrencyCompact(Number(transaction.amount))}</span>
                    <span className="hidden sm:inline">{formatCurrency(Number(transaction.amount))}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">Belum ada transaksi</p>
          </div>
        )}
      </div>

      {/* Quick Stats Panel - Mobile Layout */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Statistik Cepat
        </h2>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Rasio Pengeluaran
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
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
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Rata-rata per Transaksi
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
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

          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Perbandingan dengan bulan lalu:
            </p>
            <div
              className={`flex items-center gap-2 ${
                dashboardStats.balanceChange >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {dashboardStats.balanceChange >= 0 ? (
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-medium">
                <span className="sm:hidden">
                  {formatCurrencyCompact(Math.abs(dashboardStats.balanceChange))}
                </span>
                <span className="hidden sm:inline">
                  {formatCurrency(Math.abs(dashboardStats.balanceChange))}
                </span>
                {dashboardStats.balanceChange >= 0
                  ? " lebih baik"
                  : " lebih buruk"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Widget */}
      <BudgetWidget />
    </div>
  );
}