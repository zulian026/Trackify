// lib/services/transactionService.ts
import { supabase } from "@/lib/supabase";
import {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
  TransactionFilters,
  TransactionSummary,
} from "@/types/transaction";

export class TransactionService {
  // Get all transactions with filters
  static async getTransactions(
    userId: string,
    filters: TransactionFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Transaction[]; count: number }> {
    let query = supabase
      .from("transactions")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters.type && filters.type !== "all") {
      query = query.eq("type", filters.type);
    }

    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    if (filters.date_from) {
      query = query.gte("transaction_date", filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte("transaction_date", filters.date_to);
    }

    if (filters.search) {
      query = query.ilike("description", `%${filters.search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .returns<Transaction[]>();

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    return { data: data || [], count: count || 0 };
  }

  // Get single transaction
  static async getTransaction(
    id: string,
    userId: string
  ): Promise<Transaction> {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch transaction: ${error.message}`);
    }

    return data;
  }

  // Create new transaction
  static async createTransaction(
    userId: string,
    transactionData: CreateTransactionData
  ): Promise<Transaction> {
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        ...transactionData,
      })
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }

    return data;
  }

  // Update transaction
  static async updateTransaction(
    userId: string,
    updateData: UpdateTransactionData
  ): Promise<Transaction> {
    const { id, ...data } = updateData;

    const { data: updatedData, error } = await supabase
      .from("transactions")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to update transaction: ${error.message}`);
    }

    return updatedData;
  }

  // Delete transaction
  static async deleteTransaction(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  }

  // Get transaction summary
  static async getTransactionSummary(
    userId: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<TransactionSummary> {
    let query = supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", userId);

    if (dateFrom) {
      query = query.gte("transaction_date", dateFrom);
    }

    if (dateTo) {
      query = query.lte("transaction_date", dateTo);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch transaction summary: ${error.message}`);
    }

    const summary = data?.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.total_income += Number(transaction.amount);
        } else {
          acc.total_expense += Number(transaction.amount);
        }
        acc.transaction_count++;
        return acc;
      },
      {
        total_income: 0,
        total_expense: 0,
        net_balance: 0,
        transaction_count: 0,
      }
    ) || {
      total_income: 0,
      total_expense: 0,
      net_balance: 0,
      transaction_count: 0,
    };

    summary.net_balance = summary.total_income - summary.total_expense;

    return summary;
  }

  // Get recent transactions
  static async getRecentTransactions(
    userId: string,
    limit: number = 5
  ): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent transactions: ${error.message}`);
    }

    return data || [];
  }
}
