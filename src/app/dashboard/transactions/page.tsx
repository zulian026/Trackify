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
import { Plus, TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import { Transaction, TransactionSummary } from "@/types/transaction";
import { TransactionService } from "@/lib/services/transactionService";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user"; // Menggunakan hook user

export default function TransactionsPage() {
  const { user } = useUser(); // Mendapatkan user saat ini
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
      // Ambil ringkasan bulan ini
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

  const getCurrentMonthName = () => {
    return new Date().toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Silakan masuk untuk mengakses transaksi</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaksi</h1>
          <p className="text-muted-foreground">
            Kelola pemasukan dan pengeluaran Anda
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Judul Ringkasan Bulanan */}
        <div className="col-span-full">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">
              Ringkasan Bulan {getCurrentMonthName()}
            </h2>
          </div>
        </div>

        {/* Saldo Bersih */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Bersih</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingSummary ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                <span
                  className={
                    summary && summary.net_balance >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {summary ? formatCurrency(summary.net_balance) : "Rp 0"}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo bulan ini
            </p>
          </CardContent>
        </Card>

        {/* Total Pemasukan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loadingSummary ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                formatCurrency(summary?.total_income || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Jumlah pemasukan bulan ini
            </p>
          </CardContent>
        </Card>

        {/* Total Pengeluaran */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengeluaran
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loadingSummary ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                formatCurrency(summary?.total_expense || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Jumlah pengeluaran bulan ini
            </p>
          </CardContent>
        </Card>

        {/* Jumlah Transaksi */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Transaksi</CardTitle>
            <Badge variant="secondary">
              {loadingSummary ? "..." : summary?.transaction_count || 0}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingSummary ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                summary?.transaction_count || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total transaksi bulan ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Transaksi */}
      <TransactionList
        userId={user.id}
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}
      />

      {/* Formulir Transaksi dalam Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
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
