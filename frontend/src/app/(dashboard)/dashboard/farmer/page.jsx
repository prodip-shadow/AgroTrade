"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/axios";
import { formatMoney } from "@/lib/utils";
import { ProductForm } from "@/components/forms/product-form";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tractor,
  Package,
  Plus,
  Clock,
  CheckCircle2,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export function FarmerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadFarmerData = useCallback(() => {
    if (!user) return;
    api.get("/products/mine")
      .then((res) => {
        setProducts(res.data?.products || []);
      })
      .catch((err) => {
        console.error("Farmer products error:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
    } else if (user.role !== "farmer" && user.role !== "admin") {
      router.push(`/dashboard/${user.role}`);
    } else {
      loadFarmerData();
    }
  }, [user, authLoading, router, loadFarmerData]);

  if (authLoading || !user) {
    return <div className="p-8 text-center text-sm font-semibold text-muted-foreground">Loading Farmer Portal...</div>;
  }

  const liveApprovedCount = products.filter((p) => p.status === "active").length;
  const pendingCount = products.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Tractor className="h-4 w-4" /> Cultivator Management Portal
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Farmer Harvest Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">
            List your freshly harvested produce by category, manage your stock quantities, and connect with regional farmers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/farmers">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl font-bold">
              <Users className="h-4 w-4 text-primary" />
              <span>Fellow Farmers</span>
            </Button>
          </Link>
          <Button onClick={() => setShowAddModal(true)} size="sm" className="gap-1.5 rounded-xl font-bold">
            <Plus className="h-4 w-4" />
            <span>Add Produce</span>
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Crops Listed</span>
            <Package className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-foreground mt-2">{products.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">All catalog submissions</p>
        </Card>

        <Card className="p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Live Approved</span>
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-emerald-700 mt-2">{liveApprovedCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Visible on public market</p>
        </Card>

        <Card className="p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Pending Admin Review</span>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-600 mt-2">{pendingCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Awaiting approval</p>
        </Card>
      </div>

      {/* My Products Table */}
      <Card className="rounded-3xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div>
            <CardTitle className="text-lg">My Listed Harvests</CardTitle>
            <CardDescription>Produce submitted from your agricultural holdings.</CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Harvest
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 px-2 font-bold uppercase">Crop Name</th>
                <th className="py-3 px-2 font-bold uppercase">Category</th>
                <th className="py-3 px-2 font-bold uppercase">Price</th>
                <th className="py-3 px-2 font-bold uppercase">Stock Remaining</th>
                <th className="py-3 px-2 font-bold uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    You haven&apos;t listed any crops yet. Click &quot;Add Harvest&quot; to begin!
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40">
                    <td className="py-3.5 px-2 font-bold text-foreground flex items-center gap-2.5">
                      <img
                        src={p.image_url || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=100&q=80"}
                        alt={p.name}
                        className="h-10 w-10 rounded-xl object-cover border border-border"
                      />
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3.5 px-2 font-medium">{p.category_name || "Produce"}</td>
                    <td className="py-3.5 px-2 font-bold text-primary">{formatMoney(p.price)} / {p.unit || "kg"}</td>
                    <td className="py-3.5 px-2">{p.stock_quantity} {p.unit || "kg"}</td>
                    <td className="py-3.5 px-2">
                      <Badge variant={p.status === "active" ? "success" : p.status === "rejected" ? "destructive" : "warning"}>
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-foreground">List New Farm Harvest</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <ProductForm
              onSuccess={() => {
                setShowAddModal(false);
                loadFarmerData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerDashboardPage;
