// components/CategoryForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  TrendingUp,
  TrendingDown,
  Palette,
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
  is_default?: boolean;
}

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({
  open,
  onOpenChange,
  editingCategory,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: editingCategory?.name || "",
    type: editingCategory?.type || "expense",
    color: editingCategory?.color || "#EF4444",
    icon: editingCategory?.icon || "more-horizontal",
    is_default: editingCategory?.is_default || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when editingCategory changes
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        type: editingCategory.type,
        color: editingCategory.color,
        icon: editingCategory.icon,
        is_default: editingCategory.is_default,
      });
    } else {
      setFormData({
        name: "",
        type: "expense",
        color: "#EF4444",
        icon: "more-horizontal",
        is_default: false,
      });
    }
  }, [editingCategory]);

  const getIconComponent = (iconName: string) => {
    const iconData = AVAILABLE_ICONS.find((i) => i.name === iconName);
    return iconData ? iconData.icon : MoreHorizontal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in parent component
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      type: "expense",
      color: "#EF4444",
      icon: "more-horizontal",
      is_default: false,
    });
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color
                      ? "border-gray-900 scale-110"
                      : "border-gray-300"
                  } transition-all disabled:opacity-50`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Palette className="w-4 h-4" />
              <span className="text-sm text-gray-500">
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
                    disabled={isSubmitting}
                    className={`p-2 rounded border ${
                      formData.icon === iconData.name
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    } transition-colors disabled:opacity-50`}
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
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
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
                  className="text-xs"
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
              onClick={handleCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Menyimpan..." 
                : editingCategory 
                ? "Perbarui" 
                : "Simpan"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}