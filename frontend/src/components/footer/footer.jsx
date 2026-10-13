"use client";

import React from "react";
import Link from "next/link";
import { Sprout, Heart, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">
                Agro<span className="text-primary">Trade</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Connecting Bangladeshi farmers and consumers directly through technology. 
              Fresh organic produce, fair market values, and transparent supply chains.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Direct Farm-to-Fork Network</span>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-medium">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Seasonal Fruits
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Grains & Rice
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  All Harvests
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-4">
              Farmers & Partners
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-medium">
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Sell Produce With Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard/farmer" className="hover:text-primary transition-colors">
                  Farmer Portal
                </Link>
              </li>
              <li>
                <Link href="/farmers" className="hover:text-primary transition-colors">
                  Fellow Farmers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Why AgroTrade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-4">
              Get In Touch
            </h4>
            <div className="space-y-2.5 text-sm text-muted-foreground mb-4">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+880 1700-000000</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@agrotrade.bd</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 AgroTrade Bangladesh. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-medium">
            Developed with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for local farmers
          </p>
        </div>
      </div>
    </footer>
  );
}
