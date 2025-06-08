// lib/services/recurringTransactionService.ts
import { supabase } from "@/lib/supabase";
import {
  RecurringTransaction,
  CreateRecurringTransactionData,
  UpdateRecurringTransactionData,
  RecurringTransactionFilters,
} from "@/types/recurringTransaction";

export class RecurringTransactionService {
  // Get all recurring transactions
  static async getRecurringTransactions(
    userId: string,
    filters: RecurringTransactionFilters = {}
  ): Promise<RecurringTransaction[]> {
    let query = supabase
      .from("recurring_transactions")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("user_id", userId)
      .order("next_due_date", { ascending: true });

    // Apply filters
    if (filters.type && filters.type !== "all") {
      query = query.eq("type", filters.type);
    }

    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    if (filters.frequency) {
      query = query.eq("frequency", filters.frequency);
    }

    if (filters.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }

    const { data, error } = await query.returns<RecurringTransaction[]>();

    if (error) {
      throw new Error(`Gagal mengambil transaksi berulang: ${error.message}`);
    }

    return data || [];
  }

  // Get single recurring transaction
  static async getRecurringTransaction(
    id: string,
    userId: string
  ): Promise<RecurringTransaction> {
    const { data, error } = await supabase
      .from("recurring_transactions")
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
      throw new Error(`Gagal mengambil transaksi berulang: ${error.message}`);
    }

    return data;
  }

  // Create new recurring transaction
  static async createRecurringTransaction(
    userId: string,
    data: CreateRecurringTransactionData
  ): Promise<RecurringTransaction> {
    const nextDueDate = this.calculateNextDueDate(
      data.start_date,
      data.frequency
    );

    const { data: createdData, error } = await supabase
      .from("recurring_transactions")
      .insert({
        user_id: userId,
        ...data,
        next_due_date: nextDueDate,
      })
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .single();

    if (error) {
      throw new Error(`Gagal membuat transaksi berulang: ${error.message}`);
    }

    return createdData;
  }

  // Update recurring transaction
  static async updateRecurringTransaction(
    userId: string,
    updateData: UpdateRecurringTransactionData
  ): Promise<RecurringTransaction> {
    const { id, ...data } = updateData;

    // Recalculate next due date if frequency or start_date changed
    let nextDueDate;
    if (data.start_date || data.frequency) {
      const currentData = await this.getRecurringTransaction(id, userId);
      const startDate = data.start_date || currentData.start_date;
      const frequency = data.frequency || currentData.frequency;
      nextDueDate = this.calculateNextDueDate(startDate, frequency);
    }

    const updatePayload = {
      ...data,
      ...(nextDueDate && { next_due_date: nextDueDate }),
      updated_at: new Date().toISOString(),
    };

    const { data: updatedData, error } = await supabase
      .from("recurring_transactions")
      .update(updatePayload)
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
      throw new Error(`Gagal memperbarui transaksi berulang: ${error.message}`);
    }

    return updatedData;
  }

  // Delete recurring transaction
  static async deleteRecurringTransaction(
    id: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("recurring_transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Gagal menghapus transaksi berulang: ${error.message}`);
    }
  }

  // Toggle active status
  static async toggleRecurringTransactionStatus(
    id: string,
    userId: string,
    isActive: boolean
  ): Promise<RecurringTransaction> {
    const { data, error } = await supabase
      .from("recurring_transactions")
      .update({
        is_active: isActive,
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
      throw new Error(
        `Gagal mengubah status transaksi berulang: ${error.message}`
      );
    }

    return data;
  }

  // Get due transactions (transactions that need to be processed)
  static async getDueTransactions(
    userId: string
  ): Promise<RecurringTransaction[]> {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("recurring_transactions")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("user_id", userId)
      .eq("is_active", true)
      .lte("next_due_date", today);

    if (error) {
      throw new Error(
        `Gagal mengambil transaksi yang jatuh tempo: ${error.message}`
      );
    }

    return data || [];
  }

  // Process due transactions (create actual transactions and update next due date)
  static async processDueTransactions(userId: string): Promise<{
    processed: number;
    errors: Array<{ id: string; error: string }>;
  }> {
    const dueTransactions = await this.getDueTransactions(userId);
    let processed = 0;
    const errors: Array<{ id: string; error: string }> = [];

    for (const recurring of dueTransactions) {
      try {
        // Create actual transaction
        const { error: transactionError } = await supabase
          .from("transactions")
          .insert({
            user_id: userId,
            category_id: recurring.category_id,
            amount: recurring.amount,
            type: recurring.type,
            description:
              recurring.description ||
              `Transaksi berulang: ${recurring.category.name}`,
            transaction_date: recurring.next_due_date,
          });

        if (transactionError) {
          errors.push({
            id: recurring.id,
            error: `Gagal membuat transaksi: ${transactionError.message}`,
          });
          continue;
        }

        // Update next due date
        const nextDueDate = this.calculateNextDueDate(
          recurring.next_due_date,
          recurring.frequency
        );

        // Check if we've reached the end date
        const shouldContinue =
          !recurring.end_date || nextDueDate <= recurring.end_date;

        const { error: updateError } = await supabase
          .from("recurring_transactions")
          .update({
            next_due_date: nextDueDate,
            is_active: shouldContinue,
            updated_at: new Date().toISOString(),
          })
          .eq("id", recurring.id);

        if (updateError) {
          errors.push({
            id: recurring.id,
            error: `Gagal memperbarui tanggal jatuh tempo: ${updateError.message}`,
          });
          continue;
        }

        processed++;
      } catch (error) {
        errors.push({
          id: recurring.id,
          error: `Error tidak terduga: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }

    return { processed, errors };
  }

  // Calculate next due date based on frequency
  static calculateNextDueDate(currentDate: string, frequency: string): string {
    const date = new Date(currentDate);

    switch (frequency) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        throw new Error(`Frekuensi tidak valid: ${frequency}`);
    }

    return date.toISOString().split("T")[0];
  }

  // Get upcoming transactions (for preview/notification)
  static async getUpcomingTransactions(
    userId: string,
    days: number = 7
  ): Promise<RecurringTransaction[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const { data, error } = await supabase
      .from("recurring_transactions")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("user_id", userId)
      .eq("is_active", true)
      .gte("next_due_date", today.toISOString().split("T")[0])
      .lte("next_due_date", futureDate.toISOString().split("T")[0])
      .order("next_due_date", { ascending: true });

    if (error) {
      throw new Error(`Gagal mengambil transaksi mendatang: ${error.message}`);
    }

    return data || [];
  }

  // Get recurring transaction statistics
  static async getRecurringTransactionStats(userId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    monthlyIncome: number;
    monthlyExpense: number;
  }> {
    const { data, error } = await supabase
      .from("recurring_transactions")
      .select("is_active, type, amount, frequency")
      .eq("user_id", userId);

    if (error) {
      throw new Error(
        `Gagal mengambil statistik transaksi berulang: ${error.message}`
      );
    }

    if (!data) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
      };
    }

    const stats = data.reduce(
      (acc, transaction) => {
        acc.total++;
        if (transaction.is_active) {
          acc.active++;

          // Convert to monthly amount for estimation
          let monthlyAmount = Number(transaction.amount);
          switch (transaction.frequency) {
            case "daily":
              monthlyAmount *= 30;
              break;
            case "weekly":
              monthlyAmount *= 4.33; // Average weeks per month
              break;
            case "yearly":
              monthlyAmount /= 12;
              break;
            // monthly stays the same
          }

          if (transaction.type === "income") {
            acc.monthlyIncome += monthlyAmount;
          } else {
            acc.monthlyExpense += monthlyAmount;
          }
        } else {
          acc.inactive++;
        }
        return acc;
      },
      {
        total: 0,
        active: 0,
        inactive: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
      }
    );

    return stats;
  }
}
