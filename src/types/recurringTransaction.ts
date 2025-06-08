// types/recurringTransaction.ts
export interface RecurringTransaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
  };
}

export interface CreateRecurringTransactionData {
  category_id: string;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
}

export interface UpdateRecurringTransactionData extends Partial<CreateRecurringTransactionData> {
  id: string;
}

export interface RecurringTransactionFilters {
  type?: 'all' | 'income' | 'expense';
  category_id?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  is_active?: boolean;
}