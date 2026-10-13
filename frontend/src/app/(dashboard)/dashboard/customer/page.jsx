"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/axios";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { confirmDestructive } from "@/lib/sweetalert";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  CreditCard,
  Package,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Truck,
  RotateCcw,
} from "lucide-react";

export function CustomerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadCustomerData = useCallback(() => {
    if (!user) return;

    Promise.all([
      api.get("/orders/mine"),
      api.get("/payments/mine").catch(() => ({ data: { payments: [] } })),
    ])
      .then(([ordRes, payRes]) => {
        setOrders(ordRes.data?.orders || []);
        setPayments(payRes.data?.payments || []);
      })
      .catch((err) => {
        console.error("Customer dashboard load error:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
    } else {
      loadCustomerData();
    }
  }, [user, authLoading, router, loadCustomerData]);

  // Cancel order
  const handleCancel = async (orderId) => {
    const confirmed = await confirmDestructive({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      confirmButtonText: "Yes, cancel order",
    });
    if (!confirmed) return;

    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast.success("Order has been cancelled successfully.");
      loadCustomerData();
    } catch (err) {
      toast.error(err.message || "Failed to cancel order.");
    }
  };

  if (authLoading || !user) {
    return <div className="p-8 text-center text-sm font-semibold text-muted-foreground">Loading Account Dashboard...</div>;
  }

  const activeOrdersCount = orders.filter((o) => o.order_status === "placed" || o.order_status === "confirmed").length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <ShoppingCart className="h-4 w-4" /> Customer Account Hub
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">My Orders & Payment Records</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track your farm produce shipments, review mock transactions, and manage delivery orders.
          </p>
        </div>

        <Link href="/products">
          <Button size="sm" className="gap-1.5 rounded-xl font-bold">
            <Package className="h-4 w-4" />
            <span>Shop Fresh Produce</span>
          </Button>
        </Link>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {msg}
          </span>
          <button onClick={() => setMsg("")} className="text-xs font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Orders</span>
            <ShoppingCart className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-foreground mt-2">{orders.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Purchases placed</p>
        </Card>

        <Card className="p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Active Shipments</span>
            <Truck className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-blue-600 mt-2">{activeOrdersCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Processing or in transit</p>
        </Card>

        <Card className="p-5 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Expenditure</span>
            <CreditCard className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-primary mt-2">{formatMoney(totalSpent)}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Farm purchases total</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-primary text-primary-foreground shadow-xs font-extrabold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          My Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "payments"
              ? "bg-primary text-primary-foreground shadow-xs font-extrabold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Payment History ({payments.length || orders.length})
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === "orders" && (
        <Card className="rounded-3xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Recent Order History</CardTitle>
            <CardDescription>Review details of placed shipments and delivery destinations.</CardDescription>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-2 font-bold uppercase">Order Reference</th>
                  <th className="py-3 px-2 font-bold uppercase">Recipient & Address</th>
                  <th className="py-3 px-2 font-bold uppercase">Total Amount</th>
                  <th className="py-3 px-2 font-bold uppercase">Payment Method</th>
                  <th className="py-3 px-2 font-bold uppercase">Order Status</th>
                  <th className="py-3 px-2 font-bold uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      You haven&apos;t placed any orders yet. Browse our produce to get started!
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/30">
                      <td className="py-3.5 px-2 font-bold text-foreground">
                        {o.order_number}
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          {o.created_at ? new Date(o.created_at).toLocaleDateString() : "Recent Order"}
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="font-semibold text-foreground block">{o.delivery_name}</span>
                        <span className="text-muted-foreground text-[11px] truncate max-w-[160px] block">
                          {o.delivery_address}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 font-bold text-primary text-sm">{formatMoney(o.total_amount)}</td>
                      <td className="py-3.5 px-2 uppercase font-semibold">{o.payment_method}</td>
                      <td className="py-3.5 px-2">
                        <Badge
                          variant={
                            o.order_status === "cancelled"
                              ? "destructive"
                              : o.order_status === "delivered"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {o.order_status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-2">
                        {o.order_status === "placed" ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancel(o.id)}
                            className="h-7 text-[11px]"
                          >
                            Cancel Order
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 2: PAYMENT HISTORY */}
      {activeTab === "payments" && (
        <Card className="rounded-3xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Payment & Transaction Records</CardTitle>
            <CardDescription>Mock payments processed across mobile financial services and Cash on Delivery.</CardDescription>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-2 font-bold uppercase">Transaction / Order #</th>
                  <th className="py-3 px-2 font-bold uppercase">Provider</th>
                  <th className="py-3 px-2 font-bold uppercase">Amount</th>
                  <th className="py-3 px-2 font-bold uppercase">Payment Status</th>
                  <th className="py-3 px-2 font-bold uppercase">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(payments.length > 0 ? payments : orders).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  (payments.length > 0 ? payments : orders).map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-muted/30">
                      <td className="py-3.5 px-2 font-bold text-foreground">
                        {p.transaction_id || p.order_number || `TXN-ORD-${p.order_id || p.id}`}
                      </td>
                      <td className="py-3.5 px-2 uppercase font-semibold text-foreground">
                        {p.provider || p.payment_method || "COD"}
                      </td>
                      <td className="py-3.5 px-2 font-bold text-primary">{formatMoney(p.amount || p.total_amount)}</td>
                      <td className="py-3.5 px-2">
                        <Badge
                          variant={
                            (p.status || p.payment_status) === "paid"
                              ? "success"
                              : (p.status || p.payment_status) === "failed"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {p.status || p.payment_status || "Pending"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-2 text-muted-foreground">
                        {p.created_at ? new Date(p.created_at).toLocaleString() : "Processed"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default CustomerDashboardPage;
