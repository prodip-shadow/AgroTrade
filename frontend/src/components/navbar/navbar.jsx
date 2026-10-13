"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/button";
import { Badge } from "@/components/ui/badge";
import {
  Sprout,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Tractor,
  Store,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Wheat,
} from "lucide-react";

const emptySubscribe = () => () => {};

export function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const pathname = usePathname();

  const role = user?.role || "customer";
  const dashboardLink = `/dashboard/${role}`;

  const navLinks = [
    { href: "/", label: "Home", icon: Sprout },
    { href: "/products", label: "Farm Market", icon: Store },
    { href: "/about", label: "About Us", icon: HeartHandshake },
  ];

  if (mounted && user?.role === "farmer") {
    navLinks.push({ href: "/farmers", label: "Farmers Hub", icon: Tractor });
  }

  return (
    <>
      {/* Top Agricultural Announcement Bar */}
      <div className="bg-emerald-800 text-emerald-50 py-1.5 px-4 text-xs font-medium border-b border-emerald-700/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-600">
              <Sparkles className="h-2.5 w-2.5" /> 100% Direct
            </span>
            <span className="hidden sm:inline text-emerald-100 font-medium">
              সরাসরি প্রান্তিক কৃষকের মাঠ থেকে সেরা তাজা ফসল ও পণ্য
            </span>
            <span className="sm:hidden text-emerald-100">
              Fresh farm crops straight from rural Bangladesh
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-emerald-100 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-300" /> Verified Farmers
            </span>
            <span className="h-3 w-px bg-emerald-700" />
            <span className="flex items-center gap-1">
              <Wheat className="h-3 w-3 text-amber-300" /> Fair Price Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar Header: Fresh Organic Theme Harmonized with Site */}
      <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-[#f8fbf9]/95 backdrop-blur-md transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo with Stylish Typography */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/15 group-hover:scale-105 transition-all duration-300 ring-2 ring-emerald-500/20">
                <Sprout className="h-6 w-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                <Wheat className="h-2 w-2 text-amber-950" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-[family-name:var(--font-logo)] text-2xl font-black tracking-tight text-slate-900">
                  Agro<span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">Trade</span>
                </span>
                <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-md px-1.5 py-0.5">
                  Farm
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 tracking-wide mt-1">
                কৃষি ও কৃষকের বিশ্বস্ত বাজার
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-emerald-50/70 p-1.5 rounded-full border border-emerald-100 shadow-inner">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 font-extrabold"
                      : "text-slate-700 hover:text-emerald-800 hover:bg-emerald-100/70"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-white" : "text-emerald-600"}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50/90 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 transition-all duration-200 shadow-xs cursor-pointer group hover:scale-[1.02]"
              aria-label="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-emerald-700 group-hover:text-emerald-800 transition-colors" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-emerald-900">
                Cart {mounted && cartCount > 0 && `(${cartCount})`}
              </span>
            </button>

            {/* User Auth Section (Hydration-safe via mounted state) */}
            {mounted && user ? (
              <div className="flex items-center gap-2">
                {/* Direct Dashboard Link */}
                <Link href={dashboardLink} className="hidden sm:inline-block">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 rounded-2xl border-emerald-200 bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-800 font-bold shadow-xs transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                {/* Profile Pill Dropdown Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    {/* User Avatar */}
                    <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-xs">
                      {user.full_name ? (
                        user.full_name.charAt(0)
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                    <div className="text-left hidden md:block pr-1">
                      <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[95px]">
                        {user.full_name?.split(" ")[0] || "Account"}
                      </p>
                      <span className="text-[9px] uppercase font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.2 rounded tracking-wider">
                        {user.role}
                      </span>
                    </div>

                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 text-slate-800">
                      <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl mb-1.5">
                        <p className="text-xs font-extrabold text-slate-900 truncate">
                          {user.full_name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {user.email}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="text-[9px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200"
                          >
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      <Link
                        href={dashboardLink}
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                        My Dashboard
                      </Link>

                      {user.role === "farmer" && (
                        <Link
                          href="/farmers"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                        >
                          <Tractor className="h-4 w-4 text-emerald-600" />
                          Farmers Directory
                        </Link>
                      )}

                      <Link
                        href="/products"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        <Store className="h-4 w-4 text-emerald-600" />
                        Browse Marketplace
                      </Link>

                      <div className="h-px bg-slate-100 my-1" />

                      <button
                        onClick={async () => {
                          setUserDropdown(false);
                          const { confirmAction } =
                            await import("@/lib/sweetalert");
                          const { toast } = await import("react-toastify");
                          const confirmed = await confirmAction({
                            title: "Sign Out?",
                            text: "Are you sure you want to sign out of AgroTrade?",
                            confirmButtonText: "Yes, Sign Out",
                            icon: "question",
                          });
                          if (confirmed) {
                            logout();
                            toast.info("Signed out successfully");
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-bold rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-emerald-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20"
                  >
                    Join AgroTrade
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-3 shadow-xl text-slate-900">
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800"
                        : "text-slate-700 hover:bg-slate-50 hover:text-emerald-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-emerald-600" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {mounted && user && (
                <Link
                  href={dashboardLink}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white shadow-xs mt-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to My Dashboard ({user.role})</span>
                </Link>
              )}
            </nav>

            {mounted && !user && (
              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <Link
                  href="/login"
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
