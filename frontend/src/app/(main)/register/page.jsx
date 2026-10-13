"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { FarmerIllustration } from "@/components/illustrations/farmer-illustration";
import { Sprout, CheckCircle2, Tractor, ShieldCheck, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
        {/* Left Farmer Aesthetic Showcase Panel */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-emerald-950 flex items-center justify-center shadow-lg">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Agro<span className="text-emerald-400">Trade</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Tractor className="h-3.5 w-3.5" /> Join Our Grower Network
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Create Your Account <br />
              <span className="text-emerald-400 font-serif italic">Fair Trade for All</span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-medium">
              Join thousands of verified Bangladeshi cultivators selling direct, or families purchasing pure chemical-free harvests.
            </p>
          </div>

          {/* Embedded Custom Farmer SVG Illustration */}
          <div className="relative z-10 rounded-2xl overflow-hidden border border-emerald-700/50 shadow-xl bg-emerald-900/40 p-2">
            <FarmerIllustration className="w-full h-48 sm:h-52 object-contain" />
          </div>

          {/* Value Points */}
          <div className="space-y-2 text-xs font-semibold text-emerald-200/90 relative z-10 pt-2 border-t border-emerald-800/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Instant free crop listing & transparent market orders</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Guaranteed mobile wallet payouts to bKash & Nagad</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel: Dedicated Registration */}
        <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Register Account
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Choose your role below (Customer or Farmer) to get started immediately.
            </p>
          </div>

          {/* Dedicated Registration Form with zero tabs */}
          <AuthForm
            initialMode="register"
            showTabs={false}
            onSuccess={() => router.push("/dashboard")}
          />

          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground font-medium">
            Already have an AgroTrade account?{" "}
            <Link href="/login" className="font-extrabold text-primary hover:underline inline-flex items-center gap-1">
              <span>Sign in here</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
