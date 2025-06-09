  // app/dashboard/categories/page.tsx
  "use client";

  import { useState, useEffect } from "react";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import {
    Plus,
    Edit2,
    Trash2,
    TrendingUp,
    TrendingDown,
    Grid3X3,
    MoreHorizontal,
    Wallet,
    Banknote,
    Laptop,
    Gift,
    Utensils,
    Car,
    ShoppingBag,
    Gamepad2,
    Receipt,
    HeartPulse,
    GraduationCap,
    Home,
    Plane,
    Coffee,
    Smartphone,
    Book,
    Music,
    Camera,
    Dumbbell,
    Briefcase,
    Stethoscope,
  } from "lucide-react";
  import { Category } from "@/types/transaction";
  import { CategoryService } from "@/lib/services/categoryService";
  import { useToast } from "@/hooks/use-toast";
  import { useUser } from "@/hooks/use-user";
  import { CategoryForm } from "@/components/category/CategoryForm";

  // Available icons for categories
  const AVAILABLE_ICONS = [
    { name: "banknote", icon: Banknote },
    { name: "laptop", icon: Laptop },
    { name: "gift", icon: Gift },
    { name: "utensils", icon: Utensils },
    { name: "car", icon: Car },
    { name: "shopping-bag", icon: ShoppingBag },
    { name: "gamepad-2", icon: Gamepad2 },
    { name: "receipt", icon: Receipt },
    { name: "heart-pulse", icon: HeartPulse },
    { name: "graduation-cap", icon: GraduationCap },
    { name: "more-horizontal", icon: MoreHorizontal },
    { name: "home", icon: Home },
    { name: "plane", icon: Plane },
    { name: "coffee", icon: Coffee },
    { name: "smartphone", icon: Smartphone },
    { name: "book", icon: Book },
    { name: "music", icon: Music },
    { name: "camera", icon: Camera },
    { name: "dumbbell", icon: Dumbbell },
    { name: "briefcase", icon: Briefcase },
    { name: "stethoscope", icon: Stethoscope },
  ];

  interface CategoryFormData {
    name: string;
    type: "income" | "expense";
    color: string;
    icon: string;
    is_default?: boolean;
  }

  export default function CategoriesPage() {
    const { user } = useUser();
    const { toast } = useToast();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    useEffect(() => {
      if (user?.id) {
        loadCategories();
      }
    }, [user?.id]);

    const loadCategories = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await CategoryService.getCategories(user.id);
        setCategories(data);
      } catch (error) {
        toast({
          title: "Gagal",
          description: "Gagal memuat kategori",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const handleFormSubmit = async (formData: CategoryFormData) => {
      if (!user?.id) return;

      try {
        if (editingCategory) {
          const { is_default, ...updateData } = formData;
          await CategoryService.updateCategory(
            user.id,
            editingCategory.id,
            updateData
          );
          toast({
            title: "Berhasil",
            description: "Kategori berhasil diperbarui",
          });
        } else {
          const categoryData = {
            ...formData,
            is_default: false,
          };
          await CategoryService.createCategory(user.id, categoryData);
          toast({
            title: "Berhasil",
            description: "Kategori berhasil ditambahkan",
          });
        }

        setShowForm(false);
        setEditingCategory(null);
        loadCategories();
      } catch (error: any) {
        toast({
          title: "Gagal",
          description: error.message || "Gagal menyimpan kategori",
          variant: "destructive",
        });
        throw error; // Re-throw to handle in form component
      }
    };

    const handleDelete = async () => {
      if (!user?.id || !deleteCategory) return;

      try {
        await CategoryService.deleteCategory(user.id, deleteCategory.id);
        toast({
          title: "Berhasil",
          description: "Kategori berhasil dihapus",
        });
        setDeleteCategory(null);
        loadCategories();
      } catch (error: any) {
        toast({
          title: "Gagal",
          description: error.message || "Gagal menghapus kategori",
          variant: "destructive",
        });
      }
    };

    const handleEdit = (category: Category) => {
      setEditingCategory(category);
      setShowForm(true);
    };

    const handleFormCancel = () => {
      setShowForm(false);
      setEditingCategory(null);
    };

    const getIconComponent = (iconName: string) => {
      const iconData = AVAILABLE_ICONS.find((i) => i.name === iconName);
      return iconData ? iconData.icon : MoreHorizontal;
    };

    const incomeCategories = categories.filter((cat) => cat.type === "income");
    const expenseCategories = categories.filter((cat) => cat.type === "expense");

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
                {amount}
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
              Silakan masuk untuk mengakses kategori
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
                Kategori
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Kelola kategori pemasukan dan pengeluaran Anda
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Kategori</span>
              <span className="sm:hidden">Tambah</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <SummaryCard
            title="Total Kategori"
            amount={categories.length}
            icon={Grid3X3}
            color="blue"
            subtitle="Semua kategori aktif"
            isLoading={loading}
          />
          <SummaryCard
            title="Pemasukan"
            amount={incomeCategories.length}
            icon={TrendingUp}
            color="green"
            subtitle="Kategori pemasukan"
            isLoading={loading}
          />
          <SummaryCard
            title="Pengeluaran"
            amount={expenseCategories.length}
            icon={TrendingDown}
            color="red"
            subtitle="Kategori pengeluaran"
            isLoading={loading}
          />
          <SummaryCard
            title="Default"
            amount={categories.filter(cat => cat.is_default).length}
            icon={Wallet}
            color="purple"
            subtitle="Kategori bawaan"
            isLoading={loading}
          />
        </div>

        {/* Categories Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Daftar Kategori
          </h2>

          {/* Categories Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">Semua Kategori</TabsTrigger>
              <TabsTrigger value="income">Pemasukan</TabsTrigger>
              <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <CategoryGrid
                categories={categories}
                loading={loading}
                onEdit={handleEdit}
                onDelete={setDeleteCategory}
                getIconComponent={getIconComponent}
              />
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              <CategoryGrid
                categories={incomeCategories}
                loading={loading}
                onEdit={handleEdit}
                onDelete={setDeleteCategory}
                getIconComponent={getIconComponent}
              />
            </TabsContent>

            <TabsContent value="expense" className="space-y-4">
              <CategoryGrid
                categories={expenseCategories}
                loading={loading}
                onEdit={handleEdit}
                onDelete={setDeleteCategory}
                getIconComponent={getIconComponent}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Category Form Component */}
        <CategoryForm
          open={showForm}
          onOpenChange={setShowForm}
          editingCategory={editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteCategory}
          onOpenChange={() => setDeleteCategory(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus kategori "{deleteCategory?.name}
                "? Tindakan ini tidak dapat dibatalkan dan kategori yang sedang
                digunakan oleh transaksi tidak dapat dihapus.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Category Grid Component
  interface CategoryGridProps {
    categories: Category[];
    loading: boolean;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    getIconComponent: (iconName: string) => any;
  }

  function CategoryGrid({
    categories,
    loading,
    onEdit,
    onDelete,
    getIconComponent,
  }: CategoryGridProps) {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (categories.length === 0) {
      return (
        <div className="text-center py-8">
          <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada kategori</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          return (
            <div 
              key={category.id} 
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          category.type === "income" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {category.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </Badge>
                      {category.is_default && (
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(category)}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  {!category.is_default && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(category)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }