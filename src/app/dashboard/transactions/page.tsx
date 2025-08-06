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
  Activity,
  BarChart3,
  Eye,
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
    color = "gray",
    subtitle,
    isLoading = false,
  }: {
    title: string;
    amount: number;
    icon: any;
    color?: "gray" | "green" | "red" | "purple";
    subtitle?: string;
    isLoading?: boolean;
  }) => {
    const colorClasses = {
      gray: "bg-white border-gray-200",
      green: "bg-white border-gray-200",
      red: "bg-white border-gray-200",
      purple: "bg-white border-gray-200",
    };

    const iconColors = {
      gray: "text-gray-600 bg-gray-50",
      green: "text-green-600 bg-green-50",
      red: "text-red-600 bg-red-50",
      purple: "text-purple-600 bg-purple-50",
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
        </div>
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          {isLoading ? (
            <div className="h-6 sm:h-8 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-xl sm:text-3xl font-bold text-gray-900 leading-none">
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
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gray-50">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1">
                  Transaksi
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 font-medium">
                  Kelola pemasukan dan pengeluaran Anda
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-800 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Transaksi</span>
              <span className="sm:hidden">Tambah</span>
            </button>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <SummaryCard
            title="Saldo Bersih"
            amount={summary?.net_balance || 0}
            icon={Wallet}
            color={summary && summary.net_balance >= 0 ? "gray" : "red"}
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
            color="gray"
            subtitle="Jumlah transaksi"
            isLoading={loadingSummary}
          />
        </div>

        {/* Quick Stats Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-5 sm:mb-7">
            <div className="p-2.5 rounded-lg bg-gray-50">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Statistik Bulan Ini
            </h2>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Expense Ratio */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-semibold text-gray-700">
                  Rasio Pengeluaran
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-full">
                  {summary && summary.total_income > 0
                    ? (
                        (summary.total_expense / summary.total_income) *
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
                        summary && summary.total_income > 0
                          ? (summary.total_expense / summary.total_income) * 100
                          : 0,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Average per Transaction */}
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
            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-600 mb-3 font-medium">
                Status Keuangan Bulan Ini:
              </p>
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                  summary && summary.net_balance >= 0
                    ? "text-green-700 bg-green-50 border-green-200"
                    : "text-red-700 bg-red-50 border-red-200"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    summary && summary.net_balance >= 0
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {summary && summary.net_balance >= 0 ? (
                    <TrendingUp className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-5 h-5 flex-shrink-0" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-bold mb-1">
                    {summary && summary.net_balance >= 0
                      ? "Surplus - Kondisi keuangan baik"
                      : "Defisit - Perlu perhatian lebih"}
                  </p>
                  <p className="text-xs sm:text-sm opacity-80">
                    Saldo bersih:{" "}
                    <span className="sm:hidden">
                      {formatCurrencyCompact(summary?.net_balance || 0)}
                    </span>
                    <span className="hidden sm:inline">
                      {formatCurrency(summary?.net_balance || 0)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-5 sm:mb-7">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gray-50">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Daftar Transaksi
              </h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 text-sm font-semibold hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300">
              <span className="hidden sm:inline">Lihat Semua</span>
              <Eye className="w-4 h-4 sm:hidden" />
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
            
              {/* <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                {editingTransaction
                  ? "Edit Transaksi"
                  : "Tambah Transaksi Baru"}
              </DialogTitle> */}
           
            <TransactionForm
              userId={user.id}
              // transaction={editingTransaction || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
