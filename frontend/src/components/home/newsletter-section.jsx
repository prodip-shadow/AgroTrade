"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="max-w-md space-y-2 text-center md:text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
            Stay in the Harvest Loop
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Get alerts on fresh seasonal arrivals
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Subscribe to receive alerts when seasonal crops (like Rajshahi Fazli Mango or seasonal organic winter greens) are freshly harvested.
          </p>
        </div>

        {subscribed ? (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Thank you! You are now subscribed to AgroTrade harvest alerts.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full md:w-auto gap-3 max-w-md">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 min-w-[240px] rounded-2xl"
                required
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6 rounded-2xl font-bold">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
