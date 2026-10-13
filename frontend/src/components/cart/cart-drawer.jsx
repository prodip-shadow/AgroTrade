"use client";

import React from "react";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/button";
import { confirmDestructive } from "@/lib/sweetalert";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount,
    setIsCheckoutOpen,
  } = useCart();

  const handleRemove = async (itemId, itemName) => {
    const confirmed = await confirmDestructive({
      title: "Remove from cart?",
      text: `Remove ${itemName || "item"} from your harvest cart?`,
      confirmButtonText: "Yes, remove",
    });
    if (confirmed) {
      removeFromCart(itemId);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Scrim backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-card shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Shopping Cart</h2>
                <p className="text-xs text-muted-foreground">{cartCount} items selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">Your cart is empty</h3>
                <p className="text-xs max-w-xs mb-6">Explore our farm-fresh catalog and add fresh produce directly from farmers.</p>
                <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                  Start Shopping
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3.5 rounded-2xl border border-border/80 bg-muted/30 hover:bg-muted/60 transition-all"
                >
                  <img
                    src={
                      item.image_url ||
                      item.image ||
                      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover border border-border shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">{item.name}</h4>
                    <p className="text-xs text-primary font-semibold">
                      {formatMoney(item.price)} <span className="text-muted-foreground">/ {item.unit || "kg"}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-border rounded-lg bg-card">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      {formatMoney(Number(item.price) * item.qty)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="mt-2 text-muted-foreground hover:text-red-600 transition-colors cursor-pointer p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border bg-card space-y-3">
              <div className="flex items-center justify-between text-base">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="text-xl font-bold text-foreground">{formatMoney(cartSubtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery charges & exact distance fees are calculated at checkout.
              </p>
              <Button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full h-12 text-base font-bold shadow-md"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
