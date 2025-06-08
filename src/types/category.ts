// Types untuk Category
export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Type untuk membuat category baru
export interface CreateCategoryData {
  name: string;
  type: "income" | "expense";
  color?: string;
  icon?: string;
  is_default?: boolean;
}

// Type untuk update category
export interface UpdateCategoryData {
  id: string;
  name?: string;
  type?: "income" | "expense";
  color?: string;
  icon?: string;
  is_default?: boolean;
}

// Type untuk filter category
export interface CategoryFilters {
  type?: "income" | "expense" | "all";
  is_default?: boolean;
  search?: string;
}

// Type untuk statistik category
export interface CategoryStats {
  total: number;
  income_categories: number;
  expense_categories: number;
  default_categories: number;
}

// Type untuk category dengan jumlah transaksi
export interface CategoryWithTransactionCount extends Category {
  transaction_count: number;
  total_amount: number;
}

// Union type untuk category type
export type CategoryType = "income" | "expense";

// Konstanta untuk default colors dan icons
export const DEFAULT_CATEGORY_COLORS = [
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
  "#6B7280", // Gray (default)
] as const;

export const DEFAULT_CATEGORY_ICONS = [
  "folder",
  "shopping-cart",
  "home",
  "car",
  "utensils",
  "coffee",
  "gamepad-2",
  "heart",
  "briefcase",
  "graduation-cap",
  "plane",
  "gift",
  "music",
  "book",
  "camera",
  "smartphone",
] as const;

// Type untuk icon dan color
export type CategoryColor = (typeof DEFAULT_CATEGORY_COLORS)[number];
export type CategoryIcon = (typeof DEFAULT_CATEGORY_ICONS)[number];
