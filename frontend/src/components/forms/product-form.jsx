"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2, AlertCircle, CheckCircle2, Tag, DollarSign, Layers } from "lucide-react";

export function ProductForm({ onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      unit: "kg",
      stock_quantity: 50,
      price: 60,
    },
  });

  useEffect(() => {
    api.get("/products/categories")
      .then((res) => setCategories(res.data?.categories || []))
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await api.post("/products", {
        name: data.name,
        category_id: data.category_id ? Number(data.category_id) : null,
        price: Number(data.price),
        stock_quantity: Number(data.stock_quantity),
        unit: data.unit,
        image_url: data.image_url,
        description: data.description,
      });

      setSuccessMsg("Product submitted successfully! It is now pending admin approval.");
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
          Product Name
        </label>
        <Input
          placeholder="e.g. Fresh Organic Tomatoes"
          {...register("name", { required: "Product name is required" })}
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("category_id")}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
            Unit
          </label>
          <select
            className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("unit")}
          >
            <option value="kg">Kilogram (kg)</option>
            <option value="bundle">Bundle</option>
            <option value="piece">Piece</option>
            <option value="liter">Liter</option>
            <option value="bag">Bag</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
            Price (৳)
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="60"
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be at least 1" },
            })}
          />
          {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
            Stock Quantity
          </label>
          <Input
            type="number"
            placeholder="100"
            {...register("stock_quantity", {
              required: "Stock is required",
              min: { value: 0, message: "Stock cannot be negative" },
            })}
          />
          {errors.stock_quantity && (
            <p className="text-xs text-red-600 mt-1">{errors.stock_quantity.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
          Image URL (optional)
        </label>
        <Input
          type="url"
          placeholder="https://images.unsplash.com/photo-..."
          {...register("image_url")}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Describe your produce harvest date, quality, farm location..."
          className="flex w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("description")}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11 text-base">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit for Approval"}
      </Button>
    </form>
  );
}
