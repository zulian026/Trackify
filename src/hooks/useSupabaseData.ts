import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export function useSupabaseData<T>(
  query: string,
  dependencies: any[] = []
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const { user, session } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user || !session) {
      setLoading(false);
      setError("No authenticated user");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Verify session is still valid before making requests
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession) {
        setError("Session expired");
        setLoading(false);
        return;
      }

      // Your actual data fetching logic here
      // This is just an example - replace with your actual query
      const { data: result, error: queryError } = await supabase
        .from("your_table")
        .select("*");

      if (queryError) {
        throw queryError;
      }

      setData(result as T);
    } catch (err: any) {
      console.error("Data fetch error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, session, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
