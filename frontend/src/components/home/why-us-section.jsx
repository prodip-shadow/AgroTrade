"use client";

import React from "react";
import { Leaf, HeartHandshake, ShieldCheck, BarChart3 } from "lucide-react";

export function WhyUsSection() {
  const cards = [
    {
      icon: Leaf,
      title: "Local-First Ecosystem",
      desc: "Produce picked and delivered within nearby agricultural belts, preserving vitamins and taste.",
    },
    {
      icon: HeartHandshake,
      title: "Fair Living Returns",
      desc: "Growers receive full market value without exploitative intermediary deductions.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Authenticity",
      desc: "Every product is authenticated for health, purity, and origin before listing approval.",
    },
    {
      icon: BarChart3,
      title: "Empowering Growth",
      desc: "Providing growers with modern digital inventory, demand prediction, and transparent ledger tools.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-wider text-primary">
          Our Core Purpose
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          A Fairer Journey from Soil to Table
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          AgroTrade combines agricultural insight with digital logistics to bring honesty and security
          to every transaction across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card border border-border space-y-4 hover:border-primary/40 hover:shadow-xl transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-2xl bg-secondary text-primary flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-foreground text-lg tracking-tight">{c.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">{c.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
