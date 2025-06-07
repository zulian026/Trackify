// types/transaction.ts (Extended)
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

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  type: "income" | "expense";
  description?: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CreateTransactionData {
  category_id: string;
  amount: number;
  type: "income" | "expense";
  description?: string;
  transaction_date: string;
}

export interface UpdateTransactionData {
  id: string;
  category_id?: string;
  amount?: number;
  type?: "income" | "expense";
  description?: string;
  transaction_date?: string;
}

export interface TransactionFilters {
  type?: "income" | "expense" | "all";
  category_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface TransactionSummary {
  total_income: number;
  total_expense: number;
  net_balance: number;
  transaction_count: number;
}

// Dashboard specific types
export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  transactionCount: number;
  previousMonthBalance: number;
  balanceChange: number;
  balanceChangePercent: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface RecentTransaction extends Transaction {
  category: Category;
}
