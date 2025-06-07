"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase"; // Make sure this import is present!
import ProtectedRoute from "@/components/ProtectedRoute";

// Define types based on your database schema
interface UserData {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  id: string;
  user_id: string;
  currency: string;
  date_format: string;
  theme: "light" | "dark";
  language: string;
  notification_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface CategoryCount {
  total: number;
  income: number;
  expense: number;
}

interface TransactionStats {
  total_transactions: number;
  total_income: number;
  total_expenses: number;
  this_month_transactions: number;
}

export default function SettingsPage() {
  const { user, session, signOut } = useAuth();

  // State management
  const [userData, setUserData] = useState<UserData | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [categoryCount, setCategoryCount] = useState<CategoryCount | null>(
    null
  );
  const [transactionStats, setTransactionStats] =
    useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Form state for preferences
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [tempPrefs, setTempPrefs] = useState<Partial<UserPreferences>>({});

  const loadUserData = async () => {
    if (!user || !session) {
      setError("No authenticated user");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Verify session is still valid
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !currentSession) {
        setError("Session expired - please log in again");
        setLoading(false);
        return;
      }

      // Load user data
      const { data: userDataResult, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("User data error:", userError);
        setError(`Failed to load user data: ${userError.message}`);
        return;
      }

      setUserData(userDataResult);

      // Load or create user preferences
      let { data: prefsData, error: prefsError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (prefsError && prefsError.code === "PGRST116") {
        // No preferences found, create default ones
        const defaultPrefs = {
          user_id: user.id,
          currency: "IDR",
          date_format: "DD/MM/YYYY",
          theme: "light" as const,
          language: "id",
          notification_enabled: true,
        };

        const { data: newPrefs, error: createError } = await supabase
          .from("user_preferences")
          .insert(defaultPrefs)
          .select()
          .single();

        if (createError) {
          console.error("Create preferences error:", createError);
          setError(`Failed to create preferences: ${createError.message}`);
        } else {
          prefsData = newPrefs;
        }
      } else if (prefsError) {
        console.error("Preferences error:", prefsError);
        setError(`Failed to load preferences: ${prefsError.message}`);
      }

      if (prefsData) {
        setPreferences(prefsData);
        setTempPrefs(prefsData);
      }

      // Load category statistics
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("type")
        .eq("user_id", user.id);

      if (!catError && categories) {
        const income = categories.filter((c) => c.type === "income").length;
        const expense = categories.filter((c) => c.type === "expense").length;
        setCategoryCount({
          total: categories.length,
          income,
          expense,
        });
      }

      // Load transaction statistics
      const { data: transactions, error: transError } = await supabase
        .from("transactions")
        .select("amount, type, transaction_date")
        .eq("user_id", user.id);

      if (!transError && transactions) {
        const totalIncome = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpenses = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const thisMonthTransactions = transactions.filter((t) =>
          t.transaction_date.startsWith(currentMonth)
        ).length;

        setTransactionStats({
          total_transactions: transactions.length,
          total_income: totalIncome,
          total_expenses: totalExpenses,
          this_month_transactions: thisMonthTransactions,
        });
      }
    } catch (err: any) {
      console.error("Error loading user data:", err);
      setError(err.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    if (!preferences || !user) return;

    try {
      setUpdateLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from("user_preferences")
        .update({
          currency: tempPrefs.currency || preferences.currency,
          date_format: tempPrefs.date_format || preferences.date_format,
          theme: tempPrefs.theme || preferences.theme,
          language: tempPrefs.language || preferences.language,
          notification_enabled:
            tempPrefs.notification_enabled ?? preferences.notification_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        setError(`Failed to update preferences: ${updateError.message}`);
        return;
      }

      // Update local state
      setPreferences((prev) => (prev ? { ...prev, ...tempPrefs } : null));
      setEditingPrefs(false);

      // Show success message (you might want to add a toast notification)
      console.log("Preferences updated successfully");
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update preferences");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  useEffect(() => {
    if (user && session) {
      loadUserData();
    }
  }, [user, session]);

  const formatCurrency = (amount: number) => {
    const currency = preferences?.currency || "IDR";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="font-medium">Error:</span>
              <span className="ml-2">{error}</span>
            </div>
            <button
              onClick={loadUserData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Retry loading data
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading settings...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Information Card */}
            {userData && (
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="mt-1 text-gray-900">{userData.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900">{userData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Member Since
                    </label>
                    <p className="mt-1 text-gray-900">
                      {new Date(userData.created_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      User ID
                    </label>
                    <p className="mt-1 text-xs text-gray-500 font-mono">
                      {userData.id}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryCount && (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-800">
                      Total Categories
                    </h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {categoryCount.total}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-sm font-medium text-green-800">
                      Income Categories
                    </h3>
                    <p className="text-2xl font-bold text-green-900">
                      {categoryCount.income}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h3 className="text-sm font-medium text-red-800">
                      Expense Categories
                    </h3>
                    <p className="text-2xl font-bold text-red-900">
                      {categoryCount.expense}
                    </p>
                  </div>
                </>
              )}
              {transactionStats && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="text-sm font-medium text-purple-800">
                    Total Transactions
                  </h3>
                  <p className="text-2xl font-bold text-purple-900">
                    {transactionStats.total_transactions}
                  </p>
                </div>
              )}
            </div>

            {/* Financial Overview */}
            {transactionStats && (
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Financial Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">
                      Total Income
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      {formatCurrency(transactionStats.total_income)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-red-800">
                      {formatCurrency(transactionStats.total_expenses)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">
                      Net Balance
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        transactionStats.total_income -
                          transactionStats.total_expenses >=
                        0
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {formatCurrency(
                        transactionStats.total_income -
                          transactionStats.total_expenses
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    This month: {transactionStats.this_month_transactions}{" "}
                    transactions
                  </p>
                </div>
              </div>
            )}

            {/* User Preferences */}
            {preferences && (
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Preferences
                  </h2>
                  {!editingPrefs ? (
                    <button
                      onClick={() => setEditingPrefs(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setTempPrefs(preferences);
                          setEditingPrefs(false);
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updatePreferences}
                        disabled={updateLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {updateLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Currency
                    </label>
                    {editingPrefs ? (
                      <select
                        value={tempPrefs.currency || preferences.currency}
                        onChange={(e) =>
                          setTempPrefs((prev) => ({
                            ...prev,
                            currency: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="IDR">Indonesian Rupiah (IDR)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="SGD">Singapore Dollar (SGD)</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{preferences.currency}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Date Format
                    </label>
                    {editingPrefs ? (
                      <select
                        value={tempPrefs.date_format || preferences.date_format}
                        onChange={(e) =>
                          setTempPrefs((prev) => ({
                            ...prev,
                            date_format: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{preferences.date_format}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Theme
                    </label>
                    {editingPrefs ? (
                      <select
                        value={tempPrefs.theme || preferences.theme}
                        onChange={(e) =>
                          setTempPrefs((prev) => ({
                            ...prev,
                            theme: e.target.value as "light" | "dark",
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">
                        {preferences.theme}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Language
                    </label>
                    {editingPrefs ? (
                      <select
                        value={tempPrefs.language || preferences.language}
                        onChange={(e) =>
                          setTempPrefs((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="id">Bahasa Indonesia</option>
                        <option value="en">English</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {preferences.language === "id"
                          ? "Bahasa Indonesia"
                          : "English"}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications"
                        checked={
                          tempPrefs.notification_enabled ??
                          preferences.notification_enabled
                        }
                        onChange={(e) =>
                          setTempPrefs((prev) => ({
                            ...prev,
                            notification_enabled: e.target.checked,
                          }))
                        }
                        disabled={!editingPrefs}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="notifications"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Enable notifications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={loadUserData}
                  className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
