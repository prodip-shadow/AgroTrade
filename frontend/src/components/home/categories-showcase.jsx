"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sprout, Apple, Wheat, Milk, Sparkles, Wrench, Flower2 } from "lucide-react";

const CATEGORIES = [
  {
    name: "Vegetables",
    bengali: "তাজা শাকসবজি",
    desc: "Daily morning harvests from Bogra, Jessore & Manikganj",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    icon: Sprout,
    badge: "12+ Fresh Crops",
    color: "from-emerald-900/90 to-emerald-950/90",
  },
  {
    name: "Fruits",
    bengali: "মৌসুমি ফলমূল",
    desc: "Sweet tree-ripened mangoes, guavas, pineapples & watermelons",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
    icon: Apple,
    badge: "10+ Varieties",
    color: "from-amber-900/90 to-amber-950/90",
  },
  {
    name: "Grains & Rice",
    bengali: "চাল ও ডাল",
    desc: "Dinajpur Miniket, Nazirshail, aromatic Chinigura & unpolished lentils",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    icon: Wheat,
    badge: "Premium Sortex",
    color: "from-yellow-950/90 to-amber-950/90",
  },
  {
    name: "Dairy",
    bengali: "দুধ ও ঘি",
    desc: "Grass-fed raw cow milk, traditional hand-churned ghee & Bogra curd",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    icon: Milk,
    badge: "100% Pure Pasture",
    color: "from-sky-950/90 to-blue-950/90",
  },
  {
    name: "Seeds",
    bengali: "উন্নত বীজ",
    desc: "High germination paddy, hybrid winter vegetables & rooftop seeds",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles,
    badge: "92%+ Germination",
    color: "from-lime-950/90 to-emerald-950/90",
  },
  {
    name: "Fertilizer",
    bengali: "জৈব সার",
    desc: "Earthworm vermicompost, bone meal & mustard oil cake bio-manure",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80",
    icon: Flower2,
    badge: "Organic Soil Food",
    color: "from-stone-900/90 to-stone-950/90",
  },
  {
    name: "Tools",
    bengali: "কৃষি সরঞ্জাম",
    desc: "Traditional forged Kodal, precision sickles & drip irrigation kits",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
    icon: Wrench,
    badge: "Durable Farmer Gear",
    color: "from-zinc-900/90 to-zinc-950/90",
  },
];

export function CategoriesShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-primary mb-1">
            <Sprout className="h-4 w-4" />
            <span>Farm Produce Catalog</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Explore Agricultural Categories
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Discover seasonal regional harvests directly categorized from our verified grower clusters.
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 shrink-0"
        >
          <span>View All Categories</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl overflow-hidden border border-border/80 bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-end min-h-[220px]"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Gradient Scrim */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-black/60 to-black/30 group-hover:via-black/70 transition-colors`} />

              {/* Content */}
              <div className="relative z-10 p-5 space-y-2 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30 text-white">
                    {cat.badge}
                  </span>
                  <div className="h-8 w-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300 group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-all">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-xl tracking-tight text-white flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="h-4 w-4 text-emerald-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-[11px] text-emerald-200/90 font-medium line-clamp-1 mt-0.5">
                    {cat.bengali} · {cat.desc}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
