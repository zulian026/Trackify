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
  Calendar,
  DollarSign,
  PieChart,
  Activity,
} from "lucide-react";
import { BudgetService } from "@/lib/services/budgetService";
import { CategoryService } from "@/lib/services/categoryService";
import { Budget, BudgetWithSpending, CreateBudgetData } from "@/types/budget";
import { Category } from "@/types/transaction";
import { useAuth } from "@/contexts/AuthContext";
import BudgetForm from "@/components/budget/BudgetForm";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetWithSpending[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
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
      setLoading(false);
    }
  }, [user?.id, authLoading, loadBudgetData]);

  // Auto refresh setiap 30 detik untuk update real-time
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      loadBudgetData();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id, loadBudgetData]);

  const handleSubmit = async () => {
    if (!user?.id) {
      console.error("No user ID available");
      return;
    }

    try {
      setSubmitLoading(true);

      if (editingBudget) {
        await BudgetService.updateBudget(user.id, editingBudget.id, formData);
      } else {
        const newBudgetData = {
          ...formData,
          is_active: true,
        };
        await BudgetService.createBudget(user.id, newBudgetData);
      }

      await loadBudgetData();
      resetForm();
    } catch (error) {
      console.error("Error saving budget:", error);
    } finally {
      setSubmitLoading(false);
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

  const openCreateDialog = () => {
    setEditingBudget(null);
    setFormData({
      category_id: "",
      amount: 0,
      period_type: "monthly",
      start_date: "",
      end_date: "",
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

  // Summary Card Component
  const SummaryCard = ({
    title,
    amount,
    icon: Icon,
    color = "blue",
    subtitle,
    isLoading = false,
  }: {
    title: string;
    amount: string | number;
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
              {typeof amount === 'number' ? formatCurrency(amount) : amount}
            </p>
          )}
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  };

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
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
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            Silakan masuk untuk mengakses budget
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Login Sekarang
          </Button>
        </div>
      </div>
    );
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const activeBudgets = budgets.filter(budget => budget.is_active);
  const alertBudgets = budgets.filter(budget => budget.percentage >= 80);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Budget
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Kontrol pengeluaran Anda dengan budget yang terukur
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadBudgetData}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={openCreateDialog}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Budget</span>
              <span className="sm:hidden">Tambah</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Budget Form Dialog */}
      <BudgetForm
        isOpen={isDialogOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        editingBudget={editingBudget}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        loading={submitLoading}
      />

      {/* Alert untuk budget yang hampir habis */}
      {budgetAlerts.length > 0 && (
        <div className="mb-6">
          <Alert className="border-amber-200 bg-amber-50">
            <Bell className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Peringatan Budget!</strong> Anda memiliki{" "}
              {budgetAlerts.length} budget yang hampir habis atau sudah
              terlampaui. Periksa budget Anda di bawah.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <SummaryCard
          title="Total Budget"
          amount={totalBudget}
          icon={Target}
          color="blue"
          subtitle={`${budgets.length} budget tersedia`}
          isLoading={loading}
        />
        <SummaryCard
          title="Total Terpakai"
          amount={totalSpent}
          icon={TrendingUp}
          color="red"
          subtitle={`${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% dari total budget`}
          isLoading={loading}
        />
        <SummaryCard
          title="Sisa Budget"
          amount={totalRemaining}
          icon={DollarSign}
          color={totalRemaining < 0 ? "red" : "green"}
          subtitle="Budget yang tersisa"
          isLoading={loading}
        />
        <SummaryCard
          title="Budget Aktif"
          amount={activeBudgets.length}
          icon={Activity}
          color="purple"
          subtitle={`${alertBudgets.length} memerlukan perhatian`}
          isLoading={loading}
        />
      </div>

      {/* Budget Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Daftar Budget
        </h2>

        {loading ? (
          <BudgetGridSkeleton />
        ) : budgets.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada budget
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Mulai buat budget untuk mengontrol pengeluaran Anda
            </p>
            <Button
              onClick={openCreateDialog}
              disabled={categories.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Budget Pertama
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">Semua Budget</TabsTrigger>
              <TabsTrigger value="active">Aktif ({activeBudgets.length})</TabsTrigger>
              <TabsTrigger value="alerts">Peringatan ({alertBudgets.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <BudgetGrid
                budgets={budgets}
                categories={categories}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                formatCurrency={formatCurrency}
                getBudgetStatus={getBudgetStatus}
              />
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <BudgetGrid
                budgets={activeBudgets}
                categories={categories}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                formatCurrency={formatCurrency}
                getBudgetStatus={getBudgetStatus}
              />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <BudgetGrid
                budgets={alertBudgets}
                categories={categories}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                formatCurrency={formatCurrency}
                getBudgetStatus={getBudgetStatus}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

// Budget Grid Component
interface BudgetGridProps {
  budgets: BudgetWithSpending[];
  categories: Category[];
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
  onToggleStatus: (budgetId: string, isActive: boolean) => void;
  formatCurrency: (amount: number) => string;
  getBudgetStatus: (percentage: number) => any;
}

function BudgetGrid({
  budgets,
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
  formatCurrency,
  getBudgetStatus,
}: BudgetGridProps) {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-8">
        <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Tidak ada budget yang tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {budgets.map((budget) => {
        const status = getBudgetStatus(budget.percentage);
        const categoryData = categories.find(
          (cat) => cat.id === budget.category_id
        );

        return (
          <div
            key={budget.id}
            className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all bg-white ${
              !budget.is_active ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: categoryData?.color || "#6B7280",
                  }}
                >
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                    {categoryData?.name || "Unknown Category"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={status.variant} className="text-xs">
                      {status.text}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {budget.period_type === "monthly" ? "Bulanan" : "Tahunan"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleStatus(budget.id, !budget.is_active)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  {budget.is_active ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(budget)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(budget.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Period Info */}
            <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(budget.start_date).toLocaleDateString("id-ID")} -{" "}
              {new Date(budget.end_date).toLocaleDateString("id-ID")}
            </div>

            {/* Progress Section */}
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Terpakai</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(budget.spent)}
                  </span>
                </div>
                <Progress
                  value={Math.min(budget.percentage, 100)}
                  className="h-2"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(budget.amount)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sisa</span>
                  <span
                    className={`font-medium ${
                      budget.remaining < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(budget.remaining)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {budget.percentage.toFixed(1)}% terpakai
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Budget Grid Skeleton
function BudgetGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default BudgetPage;