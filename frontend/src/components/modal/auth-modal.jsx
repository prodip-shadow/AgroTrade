"use client";

import React from "react";
import { useCart } from "@/context/cart-context";
import { AuthForm } from "@/components/forms/auth-form";
import { X, Sprout } from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode } = useCart();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-foreground">
            Agro<span className="text-primary">Trade</span>
          </span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-1">
          {authMode === "login" ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          {authMode === "login"
            ? "Sign in to manage your orders or farmer farm produce."
            : "Connect directly with local farmers and fresh harvests."}
        </p>

        <AuthForm initialMode={authMode} onSuccess={() => setIsAuthModalOpen(false)} />
      </div>
    </div>
  );
}
