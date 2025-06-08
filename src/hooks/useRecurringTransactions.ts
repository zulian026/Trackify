// hooks/useRecurringTransactions.ts
import { useState, useEffect, useCallback } from 'react';
import { RecurringTransactionService } from '@/lib/services/recurringTransactionService';
import { 
  RecurringTransaction, 
  CreateRecurringTransactionData, 
  UpdateRecurringTransactionData,
  RecurringTransactionFilters 
} from '@/types/recurringTransaction';

interface UseRecurringTransactionsReturn {
  transactions: RecurringTransaction[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    active: number;
    inactive: number;
    monthlyIncome: number;
    monthlyExpense: number;
  };
  filters: RecurringTransactionFilters;
  setFilters: (filters: RecurringTransactionFilters) => void;
  createTransaction: (data: CreateRecurringTransactionData) => Promise<void>;
  updateTransaction: (data: UpdateRecurringTransactionData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  toggleStatus: (id: string, isActive: boolean) => Promise<void>;
  processDueTransactions: () => Promise<{ processed: number; errors: Array<{ id: string; error: string }> }>;
  getDueTransactions: () => Promise<RecurringTransaction[]>;
  getUpcomingTransactions: (days?: number) => Promise<RecurringTransaction[]>;
  refresh: () => Promise<void>;
}

export const useRecurringTransactions = (userId: string): UseRecurringTransactionsReturn => {
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RecurringTransactionFilters>({});
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
  });

  const loadTransactions = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, statsData] = await Promise.all([
        RecurringTransactionService.getRecurringTransactions(userId, filters),
        RecurringTransactionService.getRecurringTransactionStats(userId),
      ]);

      setTransactions(transactionsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      console.error('Error loading recurring transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const createTransaction = async (data: CreateRecurringTransactionData): Promise<void> => {
    try {
      setError(null);
      await RecurringTransactionService.createRecurringTransaction(userId, data);
      await loadTransactions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTransaction = async (data: UpdateRecurringTransactionData): Promise<void> => {
    try {
      setError(null);
      await RecurringTransactionService.updateRecurringTransaction(userId, data);
      await loadTransactions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    try {
      setError(null);
      await RecurringTransactionService.deleteRecurringTransaction(id, userId);
      await loadTransactions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const toggleStatus = async (id: string, isActive: boolean): Promise<void> => {
    try {
      setError(null);
      await RecurringTransactionService.toggleRecurringTransactionStatus(id, userId, isActive);
      await loadTransactions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const processDueTransactions = async (): Promise<{ processed: number; errors: Array<{ id: string; error: string }> }> => {
    try {
      setError(null);
      const result = await RecurringTransactionService.processDueTransactions(userId);
      await loadTransactions(); // Refresh data after processing
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process due transactions';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getDueTransactions = async (): Promise<RecurringTransaction[]> => {
    try {
      setError(null);
      return await RecurringTransactionService.getDueTransactions(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get due transactions';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getUpcomingTransactions = async (days: number = 7): Promise<RecurringTransaction[]> => {
    try {
      setError(null);
      return await RecurringTransactionService.getUpcomingTransactions(userId, days);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get upcoming transactions';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refresh = async (): Promise<void> => {
    await loadTransactions();
  };

  return {
    transactions,
    loading,
    error,
    stats,
    filters,
    setFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    toggleStatus,
    processDueTransactions,
    getDueTransactions,
    getUpcomingTransactions,
    refresh,
  };
};