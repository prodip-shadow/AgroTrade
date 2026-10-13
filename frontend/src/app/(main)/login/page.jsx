"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/forms/auth-form";
import { Card } from "@/components/ui/card";
import { FarmerIllustration } from "@/components/illustrations/farmer-illustration";
import { Sprout, CheckCircle2, ShieldCheck, Tractor, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
        {/* Left Farmer Aesthetic Showcase Panel */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-emerald-950 flex items-center justify-center shadow-lg">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Agro<span className="text-emerald-400">Trade</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-800/80 text-emerald-300 border border-emerald-700">
              <Tractor className="h-3.5 w-3.5" /> Cultivator & Buyer Portal
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Welcome back to <br />
              <span className="text-emerald-400 font-serif italic">Bangladesh&apos;s Farm Network</span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-medium">
              Sign in to manage your seasonal harvests, track direct farm orders, or access administrator controls.
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
              <span>Direct farmer earnings with zero syndicate deductions</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Verified 100% organic regional harvest guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel: Dedicated Sign In */}
        <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Sign In
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Enter your registered email and password to access your dashboard.
            </p>
          </div>

          {/* Dedicated Sign In Form with zero tabs */}
          <AuthForm
            initialMode="login"
            showTabs={false}
            onSuccess={() => router.push("/dashboard")}
          />

          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground font-medium">
            Don&apos;t have an AgroTrade account yet?{" "}
            <Link href="/register" className="font-extrabold text-primary hover:underline inline-flex items-center gap-1">
              <span>Register here</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
