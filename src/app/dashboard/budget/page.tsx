"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Target,
  TrendingUp,
  AlertTriangle,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  RefreshCw,
  Bell,
} from "lucide-react";
import { BudgetService } from "@/lib/services/budgetService";
import { CategoryService } from "@/lib/services/categoryService";
import { Budget, BudgetWithSpending, CreateBudgetData } from "@/types/budget";
import { Category } from "@/types/transaction";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetWithSpending[]>([]);
  const [formData, setFormData] = useState<CreateBudgetData>({
    category_id: "",
    amount: 0,
    period_type: "monthly",
    start_date: "",
    end_date: "",
  });

  // Use authentication context
  const { user, loading: authLoading, error: authError } = useAuth();

  // Fungsi untuk memuat data budget dengan spending
  const loadBudgetData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setRefreshing(true);

      // Load categories
      const categoriesData = await CategoryService.getCategoriesByType(
        user.id,
        "expense"
      );
      setCategories(categoriesData);

      // Load budgets dengan spending yang sudah dihitung
      const budgetsData = await BudgetService.getBudgetsWithSpending(user.id);
      setBudgets(budgetsData);

      // Check budget alerts
      const alerts = await BudgetService.checkBudgetAlerts(user.id);
      setBudgetAlerts(alerts);
    } catch (error) {
      console.error("Error loading budget data:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [user?.id]);

  // Load data saat komponen mount dan user tersedia
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadBudgetData();
    } else if (!authLoading && !user) {
      // Reset loading state jika tidak ada user
      setLoading(false);
    }
  }, [user?.id, authLoading, loadBudgetData]);

  // Auto refresh setiap 30 detik untuk update real-time
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      loadBudgetData();
    }, 30000); // Refresh setiap 30 detik

    return () => clearInterval(interval);
  }, [user?.id, loadBudgetData]);

  const handleSubmit = async () => {
    if (!user?.id) {
      console.error("No user ID available");
      return;
    }

    try {
      if (editingBudget) {
        await BudgetService.updateBudget(user.id, editingBudget.id, formData);
      } else {
        const newBudgetData = {
          ...formData,
          is_active: true,
        };
        await BudgetService.createBudget(user.id, newBudgetData);
      }

      // Refresh data setelah create/update
      await loadBudgetData();
      resetForm();
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const handleDelete = async (budgetId: string) => {
    if (!user?.id) return;
    if (confirm("Apakah Anda yakin ingin menghapus budget ini?")) {
      try {
        await BudgetService.deleteBudget(user.id, budgetId);
        await loadBudgetData();
      } catch (error) {
        console.error("Error deleting budget:", error);
      }
    }
  };

  const handleToggleStatus = async (budgetId: string, isActive: boolean) => {
    if (!user?.id) return;
    try {
      await BudgetService.toggleBudgetStatus(user.id, budgetId, isActive);
      await loadBudgetData();
    } catch (error) {
      console.error("Error toggling budget status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: "",
      amount: 0,
      period_type: "monthly",
      start_date: "",
      end_date: "",
    });
    setEditingBudget(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category_id: budget.category_id,
      amount: budget.amount,
      period_type: budget.period_type,
      start_date: budget.start_date,
      end_date: budget.end_date,
    });
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetStatus = (percentage: number) => {
    if (percentage >= 100)
      return {
        color: "bg-red-500",
        text: "Melebihi Budget",
        variant: "destructive" as const,
      };
    if (percentage >= 80)
      return {
        color: "bg-yellow-500",
        text: "Hampir Habis",
        variant: "secondary" as const,
      };
    if (percentage >= 60)
      return {
        color: "bg-blue-500",
        text: "Moderate",
        variant: "default" as const,
      };
    return { color: "bg-green-500", text: "Aman", variant: "default" as const };
  };

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Memuat data autentikasi...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show auth error if exists
  if (authError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              Error Autentikasi
            </h2>
            <p className="text-red-600 mb-4">{authError}</p>
            <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Akses Dibatasi
            </h2>
            <p className="text-gray-600 mb-4">
              Silakan login untuk melihat dan mengelola budget Anda
            </p>
            <Button onClick={() => (window.location.href = "/login")}>
              Login Sekarang
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  // Show loading state for budget data
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Budget</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header dengan informasi user dan tombol refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
          <p className="text-muted-foreground">
            Kontrol pengeluaran Anda dengan budget yang terukur
          </p>
          {user.email && (
            <p className="text-xs text-gray-500 mt-1">
              Logged in as: {user.email}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadBudgetData}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBudget(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingBudget ? "Edit Budget" : "Tambah Budget Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingBudget
                    ? "Ubah budget yang sudah ada"
                    : "Buat budget baru untuk mengontrol pengeluaran Anda"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  {categories.length === 0 ? (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        Tidak ada kategori pengeluaran tersedia. Silakan buat
                        kategori pengeluaran terlebih dahulu.
                      </p>
                    </div>
                  ) : (
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
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
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Jumlah Budget</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: Number(e.target.value),
                      })
                    }
                    placeholder="Masukkan jumlah budget"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Periode</Label>
                  <Select
                    value={formData.period_type}
                    onValueChange={(value: "monthly" | "yearly") =>
                      setFormData({ ...formData, period_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                      <SelectItem value="yearly">Tahunan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Tanggal Mulai</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Tanggal Berakhir</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={categories.length === 0 || !formData.category_id}
                >
                  {editingBudget ? "Update Budget" : "Buat Budget"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alert untuk budget yang hampir habis */}
      {budgetAlerts.length > 0 && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertDescription>
            <strong>Peringatan Budget!</strong> Anda memiliki{" "}
            {budgetAlerts.length} budget yang hampir habis atau sudah
            terlampaui. Periksa budget Anda di bawah.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              {budgets.length} budget aktif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Terpakai
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalBudget > 0
                ? Math.round((totalSpent / totalBudget) * 100)
                : 0}
              % dari total budget
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sisa Budget</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalRemaining < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatCurrency(totalRemaining)}
            </div>
            <p className="text-xs text-muted-foreground">Budget yang tersisa</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Daftar Budget</h2>
        {budgets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Target className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada budget
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Mulai buat budget untuk mengontrol pengeluaran Anda
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                disabled={categories.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Budget Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => {
              const status = getBudgetStatus(budget.percentage);
              const categoryData = categories.find(
                (cat) => cat.id === budget.category_id
              );

              return (
                <Card
                  key={budget.id}
                  className={!budget.is_active ? "opacity-60" : ""}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: categoryData?.color || "#6B7280",
                          }}
                        />
                        <CardTitle className="text-sm font-medium">
                          {categoryData?.name || "Unknown Category"}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant} className="text-xs">
                          {status.text}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleToggleStatus(budget.id, !budget.is_active)
                            }
                          >
                            {budget.is_active ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(budget)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(budget.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {budget.period_type === "monthly" ? "Bulanan" : "Tahunan"}{" "}
                      •{" "}
                      {new Date(budget.start_date).toLocaleDateString("id-ID")}{" "}
                      - {new Date(budget.end_date).toLocaleDateString("id-ID")}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Terpakai</span>
                        <span className="font-medium">
                          {formatCurrency(budget.spent)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(budget.percentage, 100)}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>Budget</span>
                        <span className="font-medium">
                          {formatCurrency(budget.amount)}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sisa</span>
                        <span
                          className={`font-medium ${
                            budget.remaining < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {formatCurrency(budget.remaining)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {budget.percentage.toFixed(1)}% terpakai
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
