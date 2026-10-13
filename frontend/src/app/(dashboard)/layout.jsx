"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/button";
import {
  Sprout,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  ArrowLeft,
  User,
  ShieldCheck,
  Tractor,
  Menu,
  X,
  CreditCard,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = user?.role || "customer";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-foreground">
                  Agro<span className="text-primary">Trade</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block -mt-1 tracking-wider">
                  Dashboard
                </span>
              </div>
            </Link>

            <Badge variant="outline" className="hidden sm:inline-flex uppercase font-bold text-[10px] px-2.5 py-0.5 tracking-wider">
              {role} portal
            </Badge>
          </div>

          {/* Quick links & Profile info */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
            </Link>

            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xs uppercase shadow-xs">
                  {user.full_name ? user.full_name.charAt(0) : <User className="h-4 w-4" />}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-foreground leading-tight">{user.full_name}</p>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">{user.role}</span>
                </div>
                <button
                  onClick={async () => {
                    const { confirmAction } = await import("@/lib/sweetalert");
                    const { toast } = await import("react-toastify");
                    const confirmed = await confirmAction({
                      title: "Sign Out?",
                      text: "Are you sure you want to sign out of your dashboard?",
                      confirmButtonText: "Yes, Sign Out",
                      icon: "question",
                    });
                    if (confirmed) {
                      logout();
                      toast.info("Signed out successfully");
                    }
                  }}
                  className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="flex-1 bg-muted/20">{children}</main>
    </div>
  );
}
