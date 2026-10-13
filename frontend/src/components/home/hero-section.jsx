"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Search, ArrowRight, Tractor } from "lucide-react";

export function HeroSection() {
  const router = useRouter();

  const quickCrops = [
    "Diamond Potatoes",
    "Fazli Mango",
    "Miniket Rice",
    "Deshi Ghee",
    "Green Spinach",
    "Pure Honey",
  ];

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-between overflow-hidden bg-emerald-900 text-white">
      {/* Crisp, high-clarity background farm image without any blur */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=85"
          alt="Lush green Bangladesh agricultural fields"
          className="w-full h-full object-cover object-center"
        />
        {/* Balanced gradient: keeps left-side text completely readable while keeping sunny green fields clear on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-950/50 to-emerald-900/15" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full flex-1 flex items-center">
        <div className="max-w-3xl space-y-7">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/85 border border-emerald-400/40 text-emerald-100 text-xs font-extrabold tracking-wider uppercase shadow-md">
            <Tractor className="h-4 w-4 text-emerald-300" />
            <span>
              BANGLADESH&apos;S DIRECT FARM-TO-DOOR AGRICULTURAL NETWORK
            </span>
          </div>

          {/* Inspiring Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white drop-shadow-md">
            Rooted in Soil. <br />
            <span className="text-emerald-300 italic font-serif">
              Cultivated with Dignity.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-emerald-50 leading-relaxed font-medium max-w-2xl drop-shadow-sm">
            Purchase farm-fresh seasonal vegetables, organic fruits, aromatic
            rice, and pure dairy directly from verified Bangladeshi cultivators
            with zero middlemen markups.
          </p>

          {/* Popular Crop Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <span className="text-emerald-200 font-bold">Popular Crops:</span>
            {quickCrops.map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() =>
                  router.push(`/products`)
                }
                className="px-3 py-1 rounded-full bg-black/35 hover:bg-emerald-700/80 border border-white/20 text-emerald-100 font-semibold transition-all cursor-pointer"
              >
                {crop}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trust stats bottom banner: Harmonized and smoothly connecting with the rest of the site */}
      <div className="relative z-10 w-full bg-white/95 border-t border-emerald-100 shadow-xs py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-black text-emerald-800">5,000+</p>
            <p className="text-xs text-slate-600 font-bold">
              Registered Local Farmers
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-emerald-800">54+</p>
            <p className="text-xs text-slate-600 font-bold">
              Authentic Crops & Produce
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-emerald-800">100%</p>
            <p className="text-xs text-slate-600 font-bold">
              Direct Farmer Payment
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-emerald-800">24h</p>
            <p className="text-xs text-slate-600 font-bold">
              Soil-to-Kitchen Delivery
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
