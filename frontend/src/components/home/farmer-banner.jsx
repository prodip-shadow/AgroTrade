"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Tractor, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export function FarmerBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-emerald-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-emerald-800">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800/80 text-emerald-200 border border-emerald-700">
            <Tractor className="h-3.5 w-3.5" /> Direct Farmer Partnership
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Are you a local farmer? <br />
            <span className="text-emerald-400">Sell directly on AgroTrade.</span>
          </h2>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Eliminate traditional syndicates. List your seasonal vegetables, fruits, rice and grains,
            set your own prices, track incoming orders, and get paid directly to your mobile account.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md text-xs font-semibold text-emerald-200 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Free instant product listing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Prompt guaranteed payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Real-time inventory tools</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Farmer community network</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-3">
            <Link href="/register">
              <Button size="lg" variant="light" className="font-extrabold rounded-2xl gap-2 shadow-lg">
                <span>Start Selling as a Farmer</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/farmer">
              <Button size="lg" variant="outline" className="border-emerald-600 bg-emerald-800/40 text-white hover:bg-emerald-800 rounded-2xl font-bold">
                Farmer Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
