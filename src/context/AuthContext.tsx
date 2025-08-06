"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session, Provider } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { CategoryService } from "@/lib/services/categoryService";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: Provider) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Session refresh error:", error);
        setError(error.message);
      }
    } catch (err) {
      console.error("Session refresh failed:", err);
      setError("Failed to refresh session");
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setUser(null);
          setSession(null);
        } else if (mounted) {
          setUser(session?.user ?? null);
          setSession(session);
          console.log("Session loaded:", session ? "Active" : "None");
        }
      } catch (err) {
        console.error("Failed to get session:", err);
        setError("Failed to load session");
        setUser(null);
        setSession(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "Auth state changed:",
        event,
        session ? "Session exists" : "No session"
      );

      if (mounted) {
        setUser(session?.user ?? null);
        setSession(session);
        setError(null);
        setLoading(false);
      }

      // Handle specific auth events
      if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed successfully");
      } else if (event === "SIGNED_IN") {
        console.log("User signed in");
        
        // Check if this is a new user and create default categories
        if (session?.user) {
          await handleNewUserSetup(session.user);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleNewUserSetup = async (user: User) => {
    try {
      // Check if user already exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (checkError && checkError.code === "PGRST116") {
        // User doesn't exist, create new user record
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
          avatar_url: user.user_metadata?.avatar_url || null,
        });

        if (insertError) {
          console.error("Failed to insert user data:", insertError);
        } else {
          // Create default categories for new user
          try {
            await CategoryService.createDefaultCategories(user.id);
            console.log("Default categories created for new user.");
          } catch (categoryError) {
            console.error("Failed to create default categories:", categoryError);
          }
        }
      }
    } catch (err) {
      console.error("Error in new user setup:", err);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err) {
      const error = { message: "Sign in failed" };
      setError(error.message);
      return { error };
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    } catch (err) {
      const error = { message: `${provider} sign in failed` };
      setError(error.message);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (!error && data.user) {
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
        });

        if (insertError) {
          console.error("Failed to insert user data:", insertError);
        } else {
          // Create default categories for new user
          try {
            await CategoryService.createDefaultCategories(data.user.id);
            console.log("Default categories created for new user.");
          } catch (categoryError) {
            console.error("Failed to create default categories:", categoryError);
          }
        }
      }

      return { error };
    } catch (err) {
      const error = { message: "Sign up failed" };
      setError(error.message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
      setError("Sign out failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        signIn,
        signInWithProvider,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};