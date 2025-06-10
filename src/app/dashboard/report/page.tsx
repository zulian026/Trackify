"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ReportService,
  MonthlyReport,
  CategoryReport,
  BudgetPerformance,
} from "@/lib/services/reportService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  Download,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
];

export default function ReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Data states
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<any>(null);
  const [categoryReport, setCategoryReport] = useState<CategoryReport[]>([]);
  const [budgetPerformance, setBudgetPerformance] = useState<
    BudgetPerformance[]
  >([]);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport[]>([]);

  useEffect(() => {
    if (user) {
      loadReportsData();
    }
  }, [user, selectedPeriod, selectedYear]);

  const loadReportsData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load all reports data
      const [summary, trend, categories, budget, monthly] = await Promise.all([
        ReportService.getFinancialSummary(user.id, selectedPeriod as any),
        ReportService.getMonthlyTrend(user.id, 12),
        ReportService.getCategoryReport(user.id, "expense"),
        ReportService.getBudgetPerformance(user.id),
        ReportService.getMonthlyReport(user.id, selectedYear),
      ]);

      setFinancialSummary(summary);
      setMonthlyTrend(trend);
      setCategoryReport(categories);
      setBudgetPerformance(budget);
      setMonthlyReport(monthly);
    } catch (error) {
      console.error("Error loading reports:", error);
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-gray-600">
            Analisis mendalam tentang keuangan Anda
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">Bulan Ini</SelectItem>
              <SelectItem value="last_month">Bulan Lalu</SelectItem>
              <SelectItem value="this_year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      {financialSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pemasukan
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(financialSummary.totalIncome)}
              </div>
              <p className="text-xs text-gray-600">
                {financialSummary.transactionCount} transaksi
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pengeluaran
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(financialSummary.totalExpense)}
              </div>
              <p className="text-xs text-gray-600">
                Rata-rata: {formatCurrency(financialSummary.avgDailySpending)}
                /hari
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo Bersih
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  financialSummary.netBalance >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(financialSummary.netBalance)}
              </div>
              <p className="text-xs text-gray-600">
                {financialSummary.netBalance >= 0 ? "Surplus" : "Defisit"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisasi Budget
              </CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatPercentage(financialSummary.budgetUtilization)}
              </div>
              <p className="text-xs text-gray-600">
                {financialSummary.topCategory?.name || "Tidak ada data"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Reports Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Tren</TabsTrigger>
          <TabsTrigger value="categories">Kategori</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Tren Bulanan
                </CardTitle>
                <CardDescription>
                  Pemasukan dan pengeluaran 12 bulan terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyTrend && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={monthlyTrend.labels.map(
                        (label: string, index: number) => ({
                          month: label,
                          income: monthlyTrend.income[index],
                          expense: monthlyTrend.expense[index],
                          net: monthlyTrend.netBalance[index],
                        })
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Pemasukan"
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Pengeluaran"
                      />
                      <Line
                        type="monotone"
                        dataKey="net"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Saldo Bersih"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Kategori Teratas
                </CardTitle>
                <CardDescription>
                  Pengeluaran berdasarkan kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryReport.slice(0, 5).map((category, index) => (
                    <div
                      key={category.categoryId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.categoryColor }}
                        ></div>
                        <span className="font-medium">
                          {category.categoryName}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(category.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatPercentage(category.percentage)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Monthly Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Bulanan</CardTitle>
                <CardDescription>
                  Analisis bulan ke bulan tahun {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyReport.length > 0 && (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlyReport}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Bar
                        dataKey="totalIncome"
                        fill="#10B981"
                        name="Pemasukan"
                      />
                      <Bar
                        dataKey="totalExpense"
                        fill="#EF4444"
                        name="Pengeluaran"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Pengeluaran</CardTitle>
                <CardDescription>
                  Persentase pengeluaran per kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categoryReport.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryReport}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({
                          name,
                          percentage,
                        }: {
                          name: string;
                          percentage: number;
                        }) => `${name} ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalAmount"
                      >
                        {categoryReport.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.categoryColor ||
                              COLORS[index % COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Category Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Kategori</CardTitle>
                <CardDescription>
                  Rincian pengeluaran per kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {categoryReport.map((category, index) => (
                    <div
                      key={category.categoryId}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: category.categoryColor }}
                          >
                            {category.categoryIcon}
                          </div>
                          <span className="font-semibold">
                            {category.categoryName}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {category.transactionCount} transaksi
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">
                          {formatCurrency(category.totalAmount)}
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          {formatPercentage(category.percentage)}
                        </span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Budget Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performa Budget
                </CardTitle>
                <CardDescription>
                  Status penggunaan budget per kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                {budgetPerformance.length > 0 ? (
                  <div className="space-y-4">
                    {budgetPerformance.map((budget, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {budget.categoryName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatCurrency(budget.spentAmount)} dari{" "}
                              {formatCurrency(budget.budgetAmount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                budget.status === "exceeded"
                                  ? "bg-red-100 text-red-800"
                                  : budget.status === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {budget.status === "exceeded"
                                ? "Melebihi"
                                : budget.status === "warning"
                                ? "Peringatan"
                                : "Aman"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">
                              {formatPercentage(budget.percentage)}
                            </span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${
                                budget.status === "exceeded"
                                  ? "bg-red-500"
                                  : budget.status === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(budget.percentage, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              Sisa: {formatCurrency(budget.remaining)}
                            </span>
                            <span>
                              Target: {formatCurrency(budget.budgetAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada budget yang dibuat</p>
                    <p className="text-sm">
                      Buat budget untuk melihat performa keuangan Anda
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Overview Chart */}
            {budgetPerformance.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Overview Budget</CardTitle>
                  <CardDescription>
                    Perbandingan budget vs pengeluaran aktual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={budgetPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoryName" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Bar
                        dataKey="budgetAmount"
                        fill="#3B82F6"
                        name="Budget"
                      />
                      <Bar
                        dataKey="spentAmount"
                        fill="#EF4444"
                        name="Terpakai"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insight & Rekomendasi</CardTitle>
          <CardDescription>
            Analisis otomatis berdasarkan data keuangan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Spending Insight */}
            {financialSummary && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">
                    Pola Pengeluaran
                  </h3>
                </div>
                <p className="text-sm text-blue-800">
                  Rata-rata pengeluaran harian Anda{" "}
                  {formatCurrency(financialSummary.avgDailySpending)}.
                  {financialSummary.avgDailySpending > 100000
                    ? " Coba kurangi pengeluaran harian untuk menghemat lebih banyak."
                    : " Pengeluaran harian Anda cukup terkontrol."}
                </p>
              </div>
            )}

            {/* Budget Insight */}
            {budgetPerformance.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">
                    Budget Performance
                  </h3>
                </div>
                <p className="text-sm text-green-800">
                  {budgetPerformance.filter((b) => b.status === "safe").length}{" "}
                  dari {budgetPerformance.length} budget dalam status aman.{" "}
                  {budgetPerformance.filter((b) => b.status === "exceeded")
                    .length > 0 && "Perhatikan kategori yang melebihi budget."}
                </p>
              </div>
            )}

            {/* Category Insight */}
            {categoryReport.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">
                    Kategori Dominan
                  </h3>
                </div>
                <p className="text-sm text-purple-800">
                  {categoryReport[0]?.categoryName} adalah kategori dengan
                  pengeluaran terbesar (
                  {formatPercentage(categoryReport[0]?.percentage || 0)}).
                  Pertimbangkan untuk mengoptimalkan pengeluaran di kategori
                  ini.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
