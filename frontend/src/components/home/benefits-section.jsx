"use client";

import React from "react";
import { Leaf, Tractor, TrendingUp, Truck } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Leaf,
      title: "Fresh & 100% Natural",
      desc: "Produce harvested daily and sourced directly from verified organic regional growers.",
      bg: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: Tractor,
      title: "Direct from Farmers",
      desc: "Connect directly with local agriculturalists across Rangpur, Rajshahi, Dinajpur and Bogura.",
      bg: "bg-amber-50 text-amber-700",
    },
    {
      icon: TrendingUp,
      title: "Fair Transparent Rates",
      desc: "Zero unfair syndicates. Honest market prices for buyers, respectful earnings for growers.",
      bg: "bg-blue-50 text-blue-700",
    },
    {
      icon: Truck,
      title: "Prompt Farm Logistics",
      desc: "Direct-to-door delivery with temperature control keeping produce crisp and farm-fresh.",
      bg: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className={`h-12 w-12 rounded-2xl ${b.bg} flex items-center justify-center shrink-0 shadow-inner`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-foreground text-base tracking-tight">{b.title}</h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-medium">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
