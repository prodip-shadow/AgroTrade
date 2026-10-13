"use client";

import React from "react";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, User, Check, Star } from "lucide-react";

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <Card className="group overflow-hidden rounded-3xl border border-border/80 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between bg-card">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <img
          src={
            product.image_url ||
            product.image ||
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
          }
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80";
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-xs shadow-xs font-bold text-primary">
            {product.category_name || product.category || "Produce"}
          </Badge>
        </div>
        {product.stock_quantity !== undefined && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-black/60 text-white backdrop-blur-xs">
              {product.stock_quantity > 0 ? `${product.stock_quantity} ${product.unit || "kg"} in stock` : "Out of stock"}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-extrabold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {product.rating || "4.8"}
            </span>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium mb-2">
            <User className="h-3.5 w-3.5 text-primary/70 shrink-0" />
            <span className="truncate">{product.farmer_name || product.farmer || "Local Farm Producer"}</span>
          </p>

          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-foreground tracking-tight">
                {formatMoney(product.price)}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                / {product.unit || "kg"}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => addToCart(product)}
            disabled={product.stock_quantity === 0}
            className="rounded-xl shadow-xs gap-1.5"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
