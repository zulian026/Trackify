// app/dashboard/transactions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  ChevronRight,
} from "lucide-react";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import { Transaction, TransactionSummary } from "@/types/transaction";
import { TransactionService } from "@/lib/services/transactionService";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

export default function TransactionsPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadSummary();
    }
  }, [user?.id, refreshTrigger]);

  const loadSummary = async () => {
    if (!user?.id) return;

    try {
      setLoadingSummary(true);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      const data = await TransactionService.getTransactionSummary(
        user.id,
        startOfMonth,
        endOfMonth
      );
      setSummary(data);
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Gagal memuat ringkasan transaksi",
        variant: "destructive",
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransaction(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
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

  const getCurrentMonthName = () => {
    return new Date().toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  const SummaryCard = ({
    title,
    amount,
    icon: Icon,
    color = "blue",
    subtitle,
    isLoading = false,
  }: {
    title: string;
    amount: number;
    icon: any;
    color?: "blue" | "green" | "red" | "purple";
    subtitle?: string;
    isLoading?: boolean;
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
          <div
            className={`p-2 sm:p-3 rounded-lg bg-white/60 ${iconColors[color]}`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          {isLoading ? (
            <div className="h-6 sm:h-8 bg-white/60 animate-pulse rounded"></div>
          ) : (
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              <span className="sm:hidden">{formatCurrencyCompact(amount)}</span>
              <span className="hidden sm:block">{formatCurrency(amount)}</span>
            </p>
          )}
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Silakan masuk untuk mengakses transaksi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Transaksi
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Kelola pemasukan dan pengeluaran Anda
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Transaksi</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>

        {/* Month indicator */}
        <div className="flex items-center gap-2 mt-4">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <span className="text-sm sm:text-base text-gray-600 font-medium">
            Ringkasan Bulan {getCurrentMonthName()}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <SummaryCard
          title="Saldo Bersih"
          amount={summary?.net_balance || 0}
          icon={Wallet}
          color={summary && summary.net_balance >= 0 ? "blue" : "red"}
          subtitle="Saldo bulan ini"
          isLoading={loadingSummary}
        />
        <SummaryCard
          title="Pemasukan"
          amount={summary?.total_income || 0}
          icon={TrendingUp}
          color="green"
          subtitle="Total pemasukan"
          isLoading={loadingSummary}
        />
        <SummaryCard
          title="Pengeluaran"
          amount={summary?.total_expense || 0}
          icon={TrendingDown}
          color="red"
          subtitle="Total pengeluaran"
          isLoading={loadingSummary}
        />
        <SummaryCard
          title="Transaksi"
          amount={summary?.transaction_count || 0}
          icon={Calendar}
          color="purple"
          subtitle="Jumlah transaksi"
          isLoading={loadingSummary}
        />
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Statistik Bulan Ini
        </h2>

        <div className="space-y-4 sm:space-y-6">
          {/* Expense Ratio */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Rasio Pengeluaran
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {summary && summary.total_income > 0
                  ? (
                      (summary.total_expense / summary.total_income) *
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
                    summary && summary.total_income > 0
                      ? (summary.total_expense / summary.total_income) * 100
                      : 0,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Average per Transaction */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Rata-rata per Transaksi
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                <span className="sm:hidden">
                  {formatCurrencyCompact(
                    summary && summary.transaction_count > 0
                      ? (summary.total_income + summary.total_expense) /
                          summary.transaction_count
                      : 0
                  )}
                </span>
                <span className="hidden sm:inline">
                  {formatCurrency(
                    summary && summary.transaction_count > 0
                      ? (summary.total_income + summary.total_expense) /
                          summary.transaction_count
                      : 0
                  )}
                </span>
              </span>
            </div>
          </div>

          {/* Balance Status */}
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Status Keuangan:
            </p>
            <div
              className={`flex items-center gap-2 ${
                summary && summary.net_balance >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {summary && summary.net_balance >= 0 ? (
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-medium">
                {summary && summary.net_balance >= 0
                  ? "Surplus - Kondisi keuangan baik"
                  : "Defisit - Perlu perhatian lebih"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Daftar Transaksi
          </h2>
          <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700">
            <span className="hidden sm:inline">Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <TransactionList
          userId={user.id}
          onEdit={handleEdit}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Transaction Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            userId={user.id}
            transaction={editingTransaction || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
