"use client";

import React from "react";
import { useCart } from "@/context/cart-context";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { X, ShieldCheck } from "lucide-react";

export function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen } = useCart();

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCheckoutOpen(false)}
      />

      <div className="relative w-full max-w-xl rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200 my-8">
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-primary">
            <ShieldCheck className="h-4 w-4" /> Secure Farm Checkout
          </span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-1">
          Complete Your Order
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Provide your delivery details and choose your preferred payment option.
        </p>

        <CheckoutForm onSuccess={() => setIsCheckoutOpen(false)} />
      </div>
    </div>
  );
}
