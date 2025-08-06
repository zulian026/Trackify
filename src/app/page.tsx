// src/app/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
// import CTASection from "@/components/home/CTASection";
import FeaturesSection from "@/components/home/FeatureSection";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-blue-500"></div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      <HeroSection />
      <AboutSection/>
      <FeaturesSection />
      <ContactSection/>
      <Footer />
    </div>
  );
}
