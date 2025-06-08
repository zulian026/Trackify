"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  DollarSign,
  Settings,
  Play,
  Pause,
  Trash2,
  Edit,
  Bell,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { RecurringTransactionService } from "@/lib/services/recurringTransactionService";
import { CategoryService } from "@/lib/services/categoryService";
import { useAuth } from "@/contexts/AuthContext";

// Import types (you'll need to create these files)
import type {
  RecurringTransaction,
  CreateRecurringTransactionData,
  RecurringTransactionFilters,
} from "@/types/recurringTransaction";
import type { Category } from "@/types/category";

const RecurringTransactionsPage = () => {
  const { user } = useAuth();
  const [recurringTransactions, setRecurringTransactions] = useState<
    RecurringTransaction[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<RecurringTransactionFilters>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<RecurringTransaction | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
  });

  // Form state
  const [formData, setFormData] = useState<CreateRecurringTransactionData>({
    category_id: "",
    amount: 0,
    type: "expense",
    description: "",
    frequency: "monthly",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  });

  const frequencyLabels = {
    daily: "Harian",
    weekly: "Mingguan",
    monthly: "Bulanan",
    yearly: "Tahunan",
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, categoriesData, statsData] = await Promise.all([
        RecurringTransactionService.getRecurringTransactions(user!.id, filters),
        CategoryService.getCategories(user!.id),
        RecurringTransactionService.getRecurringTransactionStats(user!.id),
      ]);

      setRecurringTransactions(transactionsData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingTransaction) {
        await RecurringTransactionService.updateRecurringTransaction(user!.id, {
          id: editingTransaction.id,
          ...formData,
        });
      } else {
        await RecurringTransactionService.createRecurringTransaction(
          user!.id,
          formData
        );
      }

      setShowForm(false);
      setEditingTransaction(null);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction);
    setFormData({
      category_id: transaction.category_id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description || "",
      frequency: transaction.frequency,
      start_date: transaction.start_date,
      end_date: transaction.end_date || "",
    });
    setShowForm(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await RecurringTransactionService.toggleRecurringTransactionStatus(
        id,
        user!.id,
        !currentStatus
      );
      await loadData();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi berulang ini?")) {
      try {
        await RecurringTransactionService.deleteRecurringTransaction(
          id,
          user!.id
        );
        await loadData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: "",
      amount: 0,
      type: "expense",
      description: "",
      frequency: "monthly",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transaksi Berulang
          </h1>
          <p className="text-gray-600">
            Kelola pemasukan dan pengeluaran berulang Anda
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingTransaction(null);
            setShowForm(true);
          }}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Transaksi Berulang
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <Play className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pemasukan/Bulan
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.monthlyIncome)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pengeluaran/Bulan
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.monthlyExpense)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.type || "all"}
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value as any })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Tipe</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>

          <select
            value={filters.category_id || ""}
            onChange={(e) =>
              setFilters({ ...filters, category_id: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filters.frequency || ""}
            onChange={(e) =>
              setFilters({ ...filters, frequency: e.target.value as any })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Frekuensi</option>
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
          </select>

          <select
            value={
              filters.is_active !== undefined
                ? filters.is_active.toString()
                : ""
            }
            onChange={(e) =>
              setFilters({
                ...filters,
                is_active:
                  e.target.value === "" ? undefined : e.target.value === "true",
              })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Daftar Transaksi Berulang</h3>
        </div>

        {recurringTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada transaksi berulang</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recurringTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: transaction.category.color }}
                    >
                      {transaction.category.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {transaction.category.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {frequencyLabels[transaction.frequency]}
                        </span>
                        <span>Mulai: {formatDate(transaction.start_date)}</span>
                        <span>
                          Berikutnya: {formatDate(transaction.next_due_date)}
                        </span>
                        {transaction.end_date && (
                          <span>
                            Berakhir: {formatDate(transaction.end_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.is_active ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleToggleStatus(
                            transaction.id,
                            transaction.is_active
                          )
                        }
                        className={`p-2 rounded-lg ${
                          transaction.is_active
                            ? "text-orange-600 hover:bg-orange-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={
                          transaction.is_active ? "Nonaktifkan" : "Aktifkan"
                        }
                      >
                        {transaction.is_active ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {editingTransaction
                  ? "Edit Transaksi Berulang"
                  : "Tambah Transaksi Berulang"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "income" | "expense",
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="expense">Pengeluaran</option>
                    <option value="income">Pemasukan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories
                      .filter((cat) => cat.type === formData.type)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frekuensi
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Berakhir (Opsional)
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Deskripsi transaksi (opsional)"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTransaction(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingTransaction ? "Update" : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringTransactionsPage;
