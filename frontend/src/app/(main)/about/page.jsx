"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import {
  Sprout,
  Heart,
  ShieldCheck,
  TrendingUp,
  Tractor,
  Users,
  Target,
  ArrowRight,
  MapPin,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80"
            alt="Bangladesh Farm Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sprout className="h-4 w-4" /> About AgroTrade Bangladesh
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Cultivating Fairness in Every Harvest
          </h1>
          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-medium">
            We are building Bangladesh&apos;s premier ethical agricultural network connecting regional growers
            directly with households, restaurants, and wholesale purchasers.
          </p>
        </div>
      </section>

      {/* Core Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-wider text-primary">
              Our Origin & Vision
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Ending Exploitative Middlemen Syndicates in Agriculture
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              In traditional markets, hardworking farmers often receive less than 40% of the retail price
              due to multi-layered intermediaries, transportation cartels, and speculative hoarding.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              AgroTrade leverages transparent inventory management, fair pricing metrics, and rapid regional
              fulfillment so that growers earn dignified wages while families receive crisp organic produce.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-card border border-border">
                <Target className="h-6 w-6 text-primary mb-2" />
                <h4 className="font-bold text-foreground text-sm">Direct Transparency</h4>
                <p className="text-xs text-muted-foreground mt-1">Full visibility of product source and price.</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border">
                <ShieldCheck className="h-6 w-6 text-primary mb-2" />
                <h4 className="font-bold text-foreground text-sm">Quality Guaranteed</h4>
                <p className="text-xs text-muted-foreground mt-1">Every harvest batch is verified before shipment.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-border shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                alt="Farmer smiling with fresh harvest"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Regional Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-card border border-border p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-primary">64</p>
            <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mt-1">
              Districts Supported
            </p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary">5,200+</p>
            <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mt-1">
              Active Cultivators
            </p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary">৳35M+</p>
            <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mt-1">
              Direct Farmer Income
            </p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary">48h</p>
            <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mt-1">
              Max Soil-to-Door Delivery
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Join the Future of Ethical Agriculture in Bangladesh
        </h3>
        <div className="flex justify-center gap-4">
          <Link href="/products">
            <Button size="lg" className="rounded-2xl font-bold">
              Shop Fresh Harvests
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="rounded-2xl font-bold">
              Join as a Farmer
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
