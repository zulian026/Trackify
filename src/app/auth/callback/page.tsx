"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          router.push("/login?error=auth_failed");
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to dashboard
          router.push("/dashboard");
        } else {
          // No session found, redirect to login
          router.push("/login");
        }
      } catch (err) {
        console.error("Unexpected error during auth callback:", err);
        router.push("/login?error=unexpected");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-800">
          Memproses autentikasi...
        </h2>
        <p className="text-gray-600 mt-2">Mohon tunggu sebentar.</p>
      </div>
    </div>
  );
}
