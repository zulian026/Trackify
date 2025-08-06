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
  ArrowUpRight,
  ArrowDownRight,
  Clock,
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
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm sm:text-base font-medium">
              Memuat transaksi...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-5 sm:mb-7">
          <div className="p-2.5 rounded-lg bg-gray-50">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Filter Transaksi
          </h3>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari transaksi..."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="pl-9 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50 focus:bg-white transition-all duration-300"
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
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50 focus:bg-white transition-all duration-300">
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
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50 focus:bg-white transition-all duration-300">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-white shadow-sm"
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
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Content */}
        <div className="p-5 sm:p-7">
          {transactions.length === 0 ? (
            <div className="text-center py-10 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm sm:text-base font-medium mb-2">
                Tidak ada transaksi ditemukan
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Coba ubah filter atau tambahkan transaksi baru
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {transactions.map((transaction) => (
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
                        {transaction.description ||
                          transaction.category?.name ||
                          "Tanpa deskripsi"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        <span className="sm:hidden">
                          {formatDateMobile(transaction.transaction_date)}
                        </span>
                        <span className="hidden sm:inline flex items-center gap-2">
                          {transaction.category && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                              <div
                                className="w-2 h-2 rounded-full border border-white shadow-sm"
                                style={{
                                  backgroundColor: transaction.category.color,
                                }}
                              />
                              {transaction.category.name}
                            </span>
                          )}
                          <span>•</span>
                          <span>
                            {formatDate(transaction.transaction_date)}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-3">
                    <div className="text-right">
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

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-8 h-8 p-0 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
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
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-gray-200 gap-4">
              <p className="text-sm text-gray-600 text-center sm:text-left font-medium">
                Menampilkan {(page - 1) * limit + 1} hingga{" "}
                {Math.min(page * limit, totalCount)} dari {totalCount} transaksi
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Selanjutnya
                </button>
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
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    transactionToDelete.type === "income"
                      ? "bg-green-100 text-green-600 border border-green-200"
                      : "bg-red-100 text-red-600 border border-red-200"
                  )}
                >
                  {getTransactionIcon(transactionToDelete.type)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {transactionToDelete.type === "income" ? "+" : "-"}
                    {formatCurrency(transactionToDelete.amount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transactionToDelete.description || "Tanpa deskripsi"}
                  </p>
                </div>
              </div>
              {transactionToDelete.category && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-700">
                  <div
                    className="w-2 h-2 rounded-full border border-white shadow-sm"
                    style={{
                      backgroundColor: transactionToDelete.category.color,
                    }}
                  />
                  {transactionToDelete.category.name}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting === transactionToDelete?.id}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting === transactionToDelete?.id}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
            >
              {deleting === transactionToDelete?.id && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
