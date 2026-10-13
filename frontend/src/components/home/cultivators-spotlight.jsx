"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Button } from "@/components/button";
import { Badge } from "@/components/ui/badge";
import {
  Tractor,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Package,
  HeartHandshake,
} from "lucide-react";

export function CultivatorsSpotlight() {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    let ignore = false;
    api
      .get("/auth/farmers")
      .then((res) => {
        if (!ignore && res.data?.farmers?.length) {
          setFarmers(res.data.farmers.slice(0, 4));
        }
      })
      .catch(() => {
        // Fallback default regional cultivator cards
        if (!ignore) {
          console.log("No Farmer comming from database");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <Tractor className="h-4 w-4" />
            <span>Honoring Our Growers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Meet Verified Regional Cultivators
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Empowering real local farmers across Bangladesh with direct market
            access and zero broker cuts.
          </p>
        </div>

        <Link href="/products">
          <Button
            variant="outline"
            className="gap-2 font-bold rounded-xl border-border hover:border-primary"
          >
            <span>Browse All Grower Harvests</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Grid of Cultivator Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {farmers.map((farmer, idx) => {
          const initials = farmer.full_name
            ? farmer.full_name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
            : "FM";

          return (
            <div
              key={farmer.id || idx}
              className="p-6 rounded-3xl bg-card border border-border shadow-xs hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Avatar and Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 flex items-center justify-center font-black text-lg border border-amber-300/40 shadow-inner">
                    {initials}
                  </div>
                  <Badge
                    variant="success"
                    className="gap-1 font-bold text-[10px]"
                  >
                    <ShieldCheck className="h-3 w-3" /> Verified Farmer
                  </Badge>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-extrabold text-foreground text-lg tracking-tight">
                    {farmer.full_name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Regional Farming Hub · Bangladesh</span>
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-primary" /> Active
                    Produce
                  </span>
                  <span className="font-black text-foreground">
                    {farmer.products_count || 10}+ Harvests
                  </span>
                </div>
              </div>

              <Link
                href={`/products?search=${encodeURIComponent(farmer.full_name.split(" ")[0])}`}
              >
                <Button
                  variant="secondary"
                  className="w-full font-bold rounded-xl text-xs gap-1.5"
                >
                  <HeartHandshake className="h-3.5 w-3.5" />
                  <span>Support & Buy Direct</span>
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
