// hooks/useDashboard.ts
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { TransactionService } from "@/lib/services/transactionService";
import { Transaction, TransactionSummary } from "@/types/transaction";

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  transactionCount: number;
  previousMonthBalance: number;
  balanceChange: number;
  balanceChangePercent: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useDashboard = (): DashboardData => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    transactionCount: 0,
    previousMonthBalance: 0,
    balanceChange: 0,
    balanceChangePercent: 0,
  });

  const getDateRanges = () => {
    const now = new Date();

    // Current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    // Previous month
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .split("T")[0];
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      .toISOString()
      .split("T")[0];

    return {
      currentMonthStart,
      currentMonthEnd,
      prevMonthStart,
      prevMonthEnd,
    };
  };

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const {
        currentMonthStart,
        currentMonthEnd,
        prevMonthStart,
        prevMonthEnd,
      } = getDateRanges();

      // Load all data concurrently
      const [recentData, currentSummary, previousSummary] = await Promise.all([
        TransactionService.getRecentTransactions(user.id, 8),
        TransactionService.getTransactionSummary(
          user.id,
          currentMonthStart,
          currentMonthEnd
        ),
        TransactionService.getTransactionSummary(
          user.id,
          prevMonthStart,
          prevMonthEnd
        ),
      ]);

      // Calculate balance change
      const balanceChange =
        currentSummary.net_balance - previousSummary.net_balance;
      const balanceChangePercent =
        previousSummary.net_balance !== 0
          ? (balanceChange / Math.abs(previousSummary.net_balance)) * 100
          : 0;

      setRecentTransactions(recentData);
      setStats({
        totalBalance: currentSummary.net_balance,
        monthlyIncome: currentSummary.total_income,
        monthlyExpense: currentSummary.total_expense,
        transactionCount: currentSummary.transaction_count,
        previousMonthBalance: previousSummary.net_balance,
        balanceChange,
        balanceChangePercent,
      });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  return {
    stats,
    recentTransactions,
    loading,
    error,
    refreshData: loadDashboardData,
  };
};
