"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/button";
import { ArrowRight, Sparkles, Sprout } from "lucide-react";

export function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    api
      .get("/products?limit=8")
      .then((res) => {
        if (!ignore && res.data?.products?.length) {
          // Exactly 4 products for homepage featured row
          setFeaturedProducts(res.data.products.slice(0, 4));
        }
      })
      .catch((err) => {
        console.error("Featured products error:", err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-primary mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Today&apos;s Handpicked Harvest</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Featured Fresh Produce
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Top-rated organic agricultural crops directly from verified regional cultivators.
          </p>
        </div>

        <Link href="/products">
          <Button variant="outline" className="gap-2 font-bold rounded-xl border-border hover:border-primary">
            <span>Explore All Harvests</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-muted/40 animate-pulse border border-border flex items-center justify-center text-muted-foreground"
            >
              <Sprout className="h-8 w-8 animate-bounce opacity-40" />
            </div>
          ))}
        </div>
      ) : featuredProducts.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-3xl bg-card border border-border">
          <p className="text-sm font-semibold text-muted-foreground">
            No live products available right now. Check back soon for fresh morning harvests!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
