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
import { Input } from "@/components/ui/input";
import { confirmAction, confirmDestructive } from "@/lib/sweetalert";
import { toast } from "react-toastify";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Trash2,
  Power,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FolderPlus,
  ShieldCheck,
  Search,
  Layers,
} from "lucide-react";

export function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const loadData = useCallback(() => {
    if (!user || user.role !== "admin") return;

    Promise.all([
      api.get("/admin/summary"),
      api.get("/admin/users"),
      api.get("/admin/orders"),
      api.get("/products/mine"),
      api.get("/products/categories"),
    ])
      .then(([sumRes, usersRes, ordersRes, prodRes, catRes]) => {
        setSummary(sumRes.data);
        setUsers(usersRes.data?.users || []);
        setOrders(ordersRes.data?.orders || []);
        setProducts(prodRes.data?.products || []);
        setCategories(catRes.data?.categories || []);
      })
      .catch((err) => {
        console.error("Admin load error:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
    } else if (user.role !== "admin") {
      router.push(`/dashboard/${user.role}`);
    } else {
      loadData();
    }
  }, [user, authLoading, router, loadData]);

  // Product status moderation
  const handleProductStatus = async (id, status) => {
    try {
      await api.patch(`/admin/products/${id}/status`, { status });
      toast.success(`Product status updated to ${status}.`);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update product status.");
    }
  };

  // Toggle user status
  const handleToggleUser = async (userId, currentActive) => {
    const actionName = currentActive ? "deactivate" : "activate";
    const confirmed = await confirmAction({
      title: `${currentActive ? "Deactivate" : "Activate"} User?`,
      text: `Are you sure you want to ${actionName} this user account?`,
      confirmButtonText: `Yes, ${actionName}`,
      icon: "warning",
    });
    if (!confirmed) return;

    try {
      await api.patch(`/admin/users/${userId}/status`);
      toast.success(`User account successfully ${actionName}d.`);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to toggle user status.");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    const confirmed = await confirmDestructive({
      title: "Delete User?",
      text: `Are you sure you want to permanently delete user "${userName || userId}"? All their produce and history will be removed.`,
      confirmButtonText: "Yes, delete user",
    });
    if (!confirmed) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User permanently deleted.");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      await api.post("/admin/categories", { name: categoryName.trim() });
      toast.success(`Category "${categoryName}" added successfully.`);
      setCategoryName("");
      setShowAddCategory(false);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to add category.");
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return <div className="p-8 text-center text-sm font-semibold text-muted-foreground">Verifying Administrator Privileges...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <ShieldCheck className="h-4 w-4" /> System Administrator Console
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Admin Overview & Moderation</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage categories, moderate farm crops, oversee orders and administer platform accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setShowAddCategory(true)} variant="outline" size="sm" className="gap-1.5 rounded-xl font-bold">
            <FolderPlus className="h-4 w-4 text-primary" />
            <span>Add Category</span>
          </Button>
          <Button onClick={() => setShowAddProduct(true)} size="sm" className="gap-1.5 rounded-xl font-bold">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {actionMsg}
          </span>
          <button onClick={() => setActionMsg("")} className="text-xs font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {["overview", "products", "categories", "users", "orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-xs font-extrabold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="p-5 rounded-3xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">Registered Users</span>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-foreground mt-2">{summary?.users || 0}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Platform members</p>
            </Card>

            <Card className="p-5 rounded-3xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">Catalog Items</span>
                <Package className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-foreground mt-2">{summary?.products || 0}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Produce listings</p>
            </Card>

            <Card className="p-5 rounded-3xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">Orders Placed</span>
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-black text-foreground mt-2">{summary?.orders || 0}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Total shipments</p>
            </Card>

            <Card className="p-5 rounded-3xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">Gross Trade</span>
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-3xl font-black text-primary mt-2">{formatMoney(summary?.order_value || 0)}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Marketplace GMV</p>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MODERATION */}
      {activeTab === "products" && (
        <Card className="rounded-3xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Moderate Produce Listings</CardTitle>
            <CardDescription>Approve, reject, or deactivate farm products uploaded by cultivators.</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-2 font-bold uppercase">Product</th>
                  <th className="py-3 px-2 font-bold uppercase">Category</th>
                  <th className="py-3 px-2 font-bold uppercase">Price</th>
                  <th className="py-3 px-2 font-bold uppercase">Stock</th>
                  <th className="py-3 px-2 font-bold uppercase">Status</th>
                  <th className="py-3 px-2 font-bold uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-muted-foreground">No products available.</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30">
                      <td className="py-3 px-2 font-bold text-foreground">{p.name}</td>
                      <td className="py-3 px-2">{p.category_name || "Produce"}</td>
                      <td className="py-3 px-2 font-bold">{formatMoney(p.price)} / {p.unit || "kg"}</td>
                      <td className="py-3 px-2">{p.stock_quantity} {p.unit || "kg"}</td>
                      <td className="py-3 px-2">
                        <Badge variant={p.status === "active" ? "success" : p.status === "rejected" ? "destructive" : "warning"}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 space-x-1.5">
                        <Button size="sm" variant="secondary" onClick={() => handleProductStatus(p.id, "active")} className="h-7 text-[11px]">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleProductStatus(p.id, "rejected")} className="h-7 text-[11px]">
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === "categories" && (
        <Card className="rounded-3xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div>
              <CardTitle className="text-lg">Product Categories</CardTitle>
              <CardDescription>All agricultural produce categories in the catalog.</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowAddCategory(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-foreground text-sm">{c.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono">slug: {c.slug}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">Active</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === "users" && (
        <Card className="rounded-3xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">User Directory & Status Control</CardTitle>
            <CardDescription>Activate, deactivate, or delete platform accounts.</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-2 font-bold uppercase">User</th>
                  <th className="py-3 px-2 font-bold uppercase">Email</th>
                  <th className="py-3 px-2 font-bold uppercase">Role</th>
                  <th className="py-3 px-2 font-bold uppercase">Status</th>
                  <th className="py-3 px-2 font-bold uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="py-3 px-2 font-bold text-foreground">{u.full_name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className="uppercase font-bold text-[10px]">{u.role}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={u.is_active ? "success" : "destructive"}>
                        {u.is_active ? "Active" : "Deactivated"}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 space-x-1.5">
                      <Button
                        size="sm"
                        variant={u.is_active ? "outline" : "secondary"}
                        onClick={() => handleToggleUser(u.id, u.is_active)}
                        className="h-7 text-[11px]"
                      >
                        <Power className="h-3 w-3 mr-1" />
                        {u.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(u.id, u.full_name)}
                        className="h-7 text-[11px]"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 5: ORDERS */}
      {activeTab === "orders" && (
        <Card className="rounded-3xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Recent Marketplace Orders</CardTitle>
            <CardDescription>Overview of customer orders across the platform.</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-2 font-bold uppercase">Order #</th>
                  <th className="py-3 px-2 font-bold uppercase">Recipient</th>
                  <th className="py-3 px-2 font-bold uppercase">Address</th>
                  <th className="py-3 px-2 font-bold uppercase">Total</th>
                  <th className="py-3 px-2 font-bold uppercase">Method</th>
                  <th className="py-3 px-2 font-bold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/30">
                    <td className="py-3 px-2 font-bold text-foreground">{o.order_number}</td>
                    <td className="py-3 px-2">{o.delivery_name}</td>
                    <td className="py-3 px-2 text-muted-foreground truncate max-w-[150px]">{o.delivery_address}</td>
                    <td className="py-3 px-2 font-bold text-primary">{formatMoney(o.total_amount)}</td>
                    <td className="py-3 px-2 uppercase font-semibold">{o.payment_method}</td>
                    <td className="py-3 px-2">
                      <Badge variant={o.order_status === "cancelled" ? "destructive" : "success"}>{o.order_status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal: Add Product */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddProduct(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-foreground">Add Product by Category</h2>
              <button onClick={() => setShowAddProduct(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <ProductForm
              onSuccess={() => {
                setShowAddProduct(false);
                loadData();
              }}
            />
          </div>
        </div>
      )}

      {/* Modal: Add Category */}
      {showAddCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddCategory(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95">
            <h2 className="text-xl font-extrabold text-foreground mb-1">Add Produce Category</h2>
            <p className="text-xs text-muted-foreground mb-4">Create a new category for products in the catalog.</p>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">Category Name</label>
                <Input
                  placeholder="e.g. Spices & Herbs"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddCategory(false)}>Cancel</Button>
                <Button type="submit">Create Category</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
