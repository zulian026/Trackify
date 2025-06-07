// types/budget.ts
export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period_type: "monthly" | "yearly";
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    color: string;
    icon: string;
    type: "income" | "expense";
  };
}

export interface BudgetWithSpending extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
}

export interface CreateBudgetData {
  category_id: string;
  amount: number;
  period_type: "monthly" | "yearly";
  start_date: string;
  end_date: string;
}
