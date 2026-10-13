"use client";

import React from "react";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AuthModal } from "@/components/modal/auth-modal";
import { CheckoutModal } from "@/components/modal/checkout-modal";
import { OrderModal } from "@/components/modal/order-modal";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <AuthModal />
      <CheckoutModal />
      <OrderModal />
    </div>
  );
}
