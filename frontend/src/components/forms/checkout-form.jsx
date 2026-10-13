"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/axios";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Truck,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  Banknote,
} from "lucide-react";

export function CheckoutForm({ onSuccess }) {
  const { cart, cartSubtotal, clearCart, setIsCheckoutOpen, setLastOrder, setIsOrderModalOpen, setIsAuthModalOpen } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const deliveryFee = cartSubtotal >= 1500 ? 0 : 60;
  const grandTotal = cartSubtotal + deliveryFee;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      delivery_name: user?.full_name || "",
      delivery_phone: user?.phone || "",
      delivery_address: "",
      payment_method: "cod",
    },
  });

  const onSubmit = async (data) => {
    if (!user) {
      setErrorMsg("Please sign in or create an account to complete your order.");
      setIsAuthModalOpen(true);
      return;
    }

    if (cart.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
        })),
        payment_method: data.payment_method,
        delivery_name: data.delivery_name,
        delivery_phone: data.delivery_phone,
        delivery_address: data.delivery_address,
      };

      const res = await api.post("/orders", payload);
      const orderInfo = {
        orderId: res.data.order_number || `AT-${res.data.order_id}`,
        id: res.data.order_id,
        method: data.payment_method.toUpperCase(),
        total: res.data.total_amount || grandTotal,
        paymentStatus: res.data.payment_status || "Pending",
        orderStatus: res.data.order_status || "Placed",
        deliveryName: data.delivery_name,
        items: [...cart],
      };

      setLastOrder(orderInfo);
      clearCart();
      setIsCheckoutOpen(false);
      setIsOrderModalOpen(true);
      if (onSuccess) onSuccess(orderInfo);
    } catch (err) {
      setErrorMsg(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Delivery details */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" /> Delivery Information
        </h3>

        <div>
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
            Recipient Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Full name of recipient"
              className="pl-10"
              {...register("delivery_name", { required: "Name is required" })}
            />
          </div>
          {errors.delivery_name && (
            <p className="text-xs text-red-600 mt-1">{errors.delivery_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
            Contact Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="01XXXXXXXXX"
              className="pl-10"
              {...register("delivery_phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+ -]{9,16}$/,
                  message: "Please enter a valid phone number",
                },
              })}
            />
          </div>
          {errors.delivery_phone && (
            <p className="text-xs text-red-600 mt-1">{errors.delivery_phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
            Delivery Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <textarea
              rows={3}
              placeholder="House, road, landmark, district"
              className="flex w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:opacity-50"
              {...register("delivery_address", { required: "Address is required" })}
            />
          </div>
          {errors.delivery_address && (
            <p className="text-xs text-red-600 mt-1">{errors.delivery_address.message}</p>
          )}
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-3 pt-2 border-t border-border">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" /> Payment Method
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-border cursor-pointer hover:bg-muted/50 has-checked:border-primary has-checked:bg-secondary/60 transition-all">
            <input type="radio" value="cod" {...register("payment_method")} className="accent-primary" />
            <Banknote className="h-5 w-5 text-emerald-700" />
            <div>
              <p className="text-sm font-bold text-foreground">Cash on Delivery</p>
              <p className="text-xs text-muted-foreground">Pay upon receiving produce</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-border cursor-pointer hover:bg-muted/50 has-checked:border-primary has-checked:bg-secondary/60 transition-all">
            <input type="radio" value="bkash" {...register("payment_method")} className="accent-primary" />
            <Smartphone className="h-5 w-5 text-pink-600" />
            <div>
              <p className="text-sm font-bold text-foreground">bKash</p>
              <p className="text-xs text-muted-foreground">Mobile Financial Service</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-border cursor-pointer hover:bg-muted/50 has-checked:border-primary has-checked:bg-secondary/60 transition-all">
            <input type="radio" value="nagad" {...register("payment_method")} className="accent-primary" />
            <Smartphone className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-bold text-foreground">Nagad</p>
              <p className="text-xs text-muted-foreground">Digital Post Office Service</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-border cursor-pointer hover:bg-muted/50 has-checked:border-primary has-checked:bg-secondary/60 transition-all">
            <input type="radio" value="card" {...register("payment_method")} className="accent-primary" />
            <CreditCard className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-bold text-foreground">Card / Online</p>
              <p className="text-xs text-muted-foreground">Visa, Mastercard, Nexus</p>
            </div>
          </label>
        </div>
      </div>

      {/* Summary lines */}
      <div className="rounded-xl bg-muted/60 p-4 space-y-2 border border-border">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Items Subtotal</span>
          <span className="font-semibold text-foreground">{formatMoney(cartSubtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Delivery Charge</span>
          <span className="font-semibold text-foreground">
            {deliveryFee === 0 ? "Free (over ৳1,500)" : formatMoney(deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
          <span>Total Payable</span>
          <span className="text-primary text-lg">{formatMoney(grandTotal)}</span>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold shadow-md">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing Order...
          </>
        ) : (
          `Confirm & Place Order (${formatMoney(grandTotal)})`
        )}
      </Button>
    </form>
  );
}
