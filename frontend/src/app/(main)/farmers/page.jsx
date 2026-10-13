"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/axios";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tractor,
  Users,
  Search,
  Phone,
  Package,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function FarmersPage() {
  const { user, loading: authLoading } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const isFarmer = user?.role === "farmer";

  useEffect(() => {
    if (!isFarmer) return;

    let ignore = false;
    api.get("/auth/farmers")
      .then((res) => {
        if (!ignore) setFarmers(res.data?.farmers || []);
      })
      .catch((err) => {
        console.error("Farmers directory error:", err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isFarmer]);

  // If not logged in or role is not farmer
  if (!authLoading && !isFarmer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
        <Card className="max-w-lg w-full p-8 text-center rounded-3xl border-border shadow-xl space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="warning" className="font-bold">Exclusive Farmer Community</Badge>
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Farmer Directory Access Restricted
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              This regional growers network is strictly reserved for verified farmers to collaborate,
              exchange agricultural insights, and view fellow partner farms.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href="/login" className="flex-1">
              <Button className="w-full font-bold">
                Sign In as Farmer
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full font-bold">
                Return to Marketplace
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const filteredFarmers = farmers.filter((f) => {
    const q = searchQuery.toLowerCase();
    return !q || f.full_name?.toLowerCase().includes(q) || f.phone?.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-primary mb-1">
            <Tractor className="h-3.5 w-3.5" />
            <span>Grower Collaborative Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Fellow Farmer Network
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with verified cultivators, cooperative clusters, and farm producers across Bangladesh.
          </p>
        </div>

        <Link href="/dashboard/farmer">
          <Button variant="outline" className="gap-2 rounded-xl">
            <span>My Farmer Portal</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search farmers by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Farmers Grid */}
      {filteredFarmers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-card border border-border">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-bold text-foreground">No farmers found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((f) => (
            <Card key={f.id} className="p-6 rounded-3xl border border-border hover:border-primary/50 transition-all shadow-xs">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-secondary text-primary flex items-center justify-center font-black text-lg">
                    <Tractor className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-base tracking-tight">{f.full_name}</h3>
                    <Badge variant="success" className="text-[10px] mt-0.5">Verified Grower</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-border pt-3">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary" /> Contact Phone
                  </span>
                  <span className="font-bold text-foreground">{f.phone || "Private Contact"}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-primary" /> Active Produce Listed
                  </span>
                  <span className="font-bold text-primary">{f.products_count || 0} Crops</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Member Since
                  </span>
                  <span>{f.created_at ? new Date(f.created_at).toLocaleDateString() : "Verified Farmer"}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
