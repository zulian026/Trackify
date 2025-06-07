// types/db.ts

export type UUID = string;

export type User = {
  id: UUID;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CategoryType = "income" | "expense";

export type Category = {
  id: UUID;
  user_id: UUID;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type PeriodType = "monthly" | "yearly";

export type Budget = {
  id: UUID;
  user_id: UUID;
  category_id: UUID;
  amount: number;
  period_type: PeriodType;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: UUID;
  user_id: UUID;
  category_id: UUID;
  amount: number;
  type: CategoryType;
  description: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
};

export type Frequency = "daily" | "weekly" | "monthly" | "yearly";

export type RecurringTransaction = {
  id: UUID;
  user_id: UUID;
  category_id: UUID;
  amount: number;
  type: CategoryType;
  description: string | null;
  frequency: Frequency;
  start_date: string;
  end_date: string | null;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Theme = "light" | "dark";

export type UserPreferences = {
  id: UUID;
  user_id: UUID;
  currency: string;
  date_format: string;
  theme: Theme;
  language: string;
  notification_enabled: boolean;
  created_at: string;
  updated_at: string;
};
