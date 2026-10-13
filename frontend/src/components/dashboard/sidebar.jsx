"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import {
  Sprout,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  ArrowLeft,
  X,
  User,
  ShieldCheck,
  Tractor,
} from "lucide-react";

export function DashboardSidebar({ currentTab, setCurrentTab, onClose }) {
  const { user, logout } = useAuth();
  const role = user?.role || "customer";

  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              Agro<span className="text-primary">Trade</span>
            </span>
          </Link>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-1 rounded-lg text-muted-foreground hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User preview card */}
        {user && (
          <div className="p-3.5 rounded-2xl bg-secondary/50 border border-emerald-200/60 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
              {role === "farmer" ? (
                <Tractor className="h-5 w-5" />
              ) : role === "admin" ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">{user.full_name}</p>
              <Badge variant="default" className="text-[10px] py-0 px-2 mt-0.5 uppercase tracking-wider">
                {user.role}
              </Badge>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="space-y-1.5 text-sm font-semibold">
          <button
            onClick={() => {
              setCurrentTab("overview");
              if (onClose) onClose();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              currentTab === "overview"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>

          {(role === "farmer" || role === "admin") && (
            <button
              onClick={() => {
                setCurrentTab("products");
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                currentTab === "products"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Package className="h-4 w-4" />
              My Products
            </button>
          )}

          <button
            onClick={() => {
              setCurrentTab("orders");
              if (onClose) onClose();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              currentTab === "orders"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {role === "admin" ? "All Orders" : "My Orders"}
          </button>

          {role === "admin" && (
            <button
              onClick={() => {
                setCurrentTab("users");
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                currentTab === "users"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              Users Directory
            </button>
          )}
        </nav>
      </div>

      {/* Bottom actions */}
      <div className="space-y-2 pt-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}
