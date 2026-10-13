"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, Check, ArrowRight, X } from "lucide-react";

export function OrderModal() {
  const { isOrderModalOpen, setIsOrderModalOpen, lastOrder } = useCart();
  const [copied, setCopied] = useState(false);

  if (!isOrderModalOpen || !lastOrder) return null;

  const handleCopy = () => {
    if (lastOrder?.orderId && navigator.clipboard) {
      navigator.clipboard.writeText(lastOrder.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsOrderModalOpen(false)}
      />

      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsOrderModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <Badge variant="success" className="mb-2">Order Confirmed</Badge>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Thank you for your order!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your fresh agricultural order has been placed successfully.
          </p>
        </div>

        {/* Order ID box */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/60 border border-border mb-6">
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Order Reference</p>
            <p className="text-base font-extrabold text-foreground">{lastOrder.orderId}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        {/* Details list */}
        <div className="space-y-3 p-4 rounded-2xl border border-border text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method:</span>
            <span className="font-bold text-foreground">{lastOrder.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status:</span>
            <Badge variant="warning">{lastOrder.paymentStatus}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Status:</span>
            <Badge variant="success">{lastOrder.orderStatus}</Badge>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
            <span>Total Amount:</span>
            <span className="text-primary">{formatMoney(lastOrder.total)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsOrderModalOpen(false)}
          >
            Continue Shopping
          </Button>
          <Link href="/dashboard" className="flex-1" onClick={() => setIsOrderModalOpen(false)}>
            <Button className="w-full gap-1.5">
              View in Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
