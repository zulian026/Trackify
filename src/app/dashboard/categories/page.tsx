// app/dashboard/categories/page.tsx
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Palette,
  Grid3X3,
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
  MoreHorizontal,
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

// Available icons for categories
const AVAILABLE_ICONS = [
  { name: "banknote", icon: Banknote },
  { name: "laptop", icon: Laptop },
  { name: "trending-up", icon: TrendingUp },
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

// Available colors for categories
const AVAILABLE_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#EAB308", // Yellow
  "#84CC16", // Lime
  "#22C55E", // Green
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#0EA5E9", // Sky
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#D946EF", // Fuchsia
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#6B7280", // Gray
];

interface CategoryFormData {
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
  is_default?: boolean; // Add this optional property
}

export default function CategoriesPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    type: "expense",
    color: "#EF4444",
    icon: "more-horizontal",
    is_default: false, // Initialize with default value
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      if (editingCategory) {
        // For updates, we need to exclude is_default from the update data
        // since it shouldn't be changed for existing categories
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
        // For new categories, ensure is_default is set to false
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

      handleCloseForm();
      loadCategories();
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menyimpan kategori",
        variant: "destructive",
      });
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
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      is_default: category.is_default,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      type: "expense",
      color: "#EF4444",
      icon: "more-horizontal",
      is_default: false,
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconData = AVAILABLE_ICONS.find((i) => i.name === iconName);
    return iconData ? iconData.icon : MoreHorizontal;
  };

  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Silakan masuk untuk mengakses kategori</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kategori</h1>
          <p className="text-muted-foreground">
            Kelola kategori pemasukan dan pengeluaran Anda
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Kategori
            </CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Semua kategori aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kategori Pemasukan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {incomeCategories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Kategori pemasukan aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kategori Pengeluaran
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {expenseCategories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Kategori pengeluaran aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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

      {/* Category Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Masukkan nama kategori"
                required
              />
            </div>

            {/* Category Type */}
            <div className="space-y-2">
              <Label>Jenis Kategori</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "income" | "expense") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Pemasukan
                    </div>
                  </SelectItem>
                  <SelectItem value="expense">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      Pengeluaran
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <Label>Warna Kategori</Label>
              <div className="grid grid-cols-6 gap-2">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-gray-900 scale-110"
                        : "border-gray-300"
                    } transition-all`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Palette className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  Warna terpilih: {formData.color}
                </span>
              </div>
            </div>

            {/* Icon Picker */}
            <div className="space-y-2">
              <Label>Ikon Kategori</Label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {AVAILABLE_ICONS.map((iconData) => {
                  const IconComponent = iconData.icon;
                  return (
                    <button
                      key={iconData.name}
                      type="button"
                      className={`p-2 rounded border ${
                        formData.icon === iconData.name
                          ? "border-primary bg-primary/10"
                          : "border-gray-300 hover:border-gray-400"
                      } transition-colors`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          icon: iconData.name,
                        }))
                      }
                    >
                      <IconComponent className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: formData.color }}
                >
                  {(() => {
                    const IconComponent = getIconComponent(formData.icon);
                    return <IconComponent className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div>
                  <p className="font-medium">
                    {formData.name || "Nama Kategori"}
                  </p>
                  <Badge
                    variant={
                      formData.type === "income" ? "default" : "secondary"
                    }
                  >
                    {formData.type === "income" ? "Pemasukan" : "Pengeluaran"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseForm}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                {editingCategory ? "Perbarui" : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Grid3X3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada kategori</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const IconComponent = getIconComponent(category.icon);
        return (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <Badge
                      variant={
                        category.type === "income" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {category.type === "income" ? "Pemasukan" : "Pengeluaran"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(category)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  {!category.is_default && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(category)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
