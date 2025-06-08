// components/transactions/TransactionList.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Minus,
  Calendar,
  Tag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Transaction, TransactionFilters, Category } from "@/types/transaction";
import { TransactionService } from "@/lib/services/transactionService";
import { CategoryService } from "@/lib/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  userId: string;
  onEdit: (transaction: Transaction) => void;
  refreshTrigger?: number;
}

export default function TransactionList({
  userId,
  onEdit,
  refreshTrigger = 0,
}: TransactionListProps) {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const [filters, setFilters] = useState<TransactionFilters>({
    type: "all",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadTransactions();
  }, [userId, filters, page, refreshTrigger]);

  useEffect(() => {
    loadCategories();
  }, [userId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { data, count } = await TransactionService.getTransactions(
        userId,
        filters,
        page,
        limit
      );
      setTransactions(data);
      setTotalCount(count);
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal memuat transaksi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await CategoryService.getCategories(userId);
      setCategories(data);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    try {
      setDeleting(transactionToDelete.id);
      await TransactionService.deleteTransaction(
        transactionToDelete.id,
        userId
      );

      toast({
        title: "Berhasil",
        description: "Transaksi berhasil dihapus",
      });

      loadTransactions();
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menghapus transaksi",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
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
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      search: "",
    });
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  if (loading && transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm sm:text-base">Memuat transaksi...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Filter Transaksi
          </h3>
        </div>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari transaksi..."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="pl-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Type Filter */}
            <div className="flex-1">
              <Select
                value={filters.type || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: value as "income" | "expense" | "all",
                  }))
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <Select
                value={filters.category_id || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    category_id: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Daftar Transaksi ({totalCount})
            </h3>
            {loading && (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-base sm:text-lg font-medium mb-2">
                Tidak ada transaksi ditemukan
              </p>
              <p className="text-gray-400 text-sm sm:text-base">
                Coba ubah filter atau tambahkan transaksi baru
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  {/* Transaction Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0",
                      transaction.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    )}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>

                  {/* Transaction Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {transaction.description || "Tanpa deskripsi"}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            {formatDate(transaction.transaction_date)}
                          </div>

                          {transaction.category && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor: transaction.category.color,
                                }}
                              />
                              <span className="truncate max-w-20 sm:max-w-none">
                                {transaction.category.name}
                              </span>
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Amount and Actions */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-right">
                          <p className="text-sm sm:hidden font-semibold">
                            <span
                              className={cn(
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              )}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatCurrencyCompact(transaction.amount)}
                            </span>
                          </p>
                          <p className="hidden sm:block text-base font-semibold">
                            <span
                              className={cn(
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              )}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </p>
                        </div>

                        {/* Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => onEdit(transaction)}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(transaction)}
                              className="flex items-center gap-2 text-sm text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-4">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                Menampilkan {(page - 1) * limit + 1} hingga{" "}
                {Math.min(page * limit, totalCount)} dari {totalCount} transaksi
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page === totalPages}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Hapus Transaksi
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {transactionToDelete && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    transactionToDelete.type === "income"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {transactionToDelete.type === "income" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(transactionToDelete.amount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transactionToDelete.description || "Tanpa deskripsi"}
                  </p>
                </div>
              </div>
              {transactionToDelete.category && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 w-fit bg-gray-100 text-gray-700"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: transactionToDelete.category.color,
                    }}
                  />
                  {transactionToDelete.category.name}
                </Badge>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting === transactionToDelete?.id}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting === transactionToDelete?.id}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting === transactionToDelete?.id && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
