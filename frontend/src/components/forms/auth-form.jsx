"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  User,
  Phone,
  Tractor,
  ShoppingBag,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function AuthForm({ initialMode = "login", showTabs = false, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register: authRegister } = useAuth();
  const { setIsAuthModalOpen } = useCart();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      role: "customer",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const loggedUser = await login(data.email, data.password);
        toast.success(`Welcome back, ${loggedUser.full_name || "Cultivator"}!`);
      } else {
        const registeredUser = await authRegister({
          full_name: data.full_name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          role: data.role,
        });
        toast.success(
          `Account created successfully as ${
            registeredUser.role === "farmer" ? "Farmer" : "Customer"
          }!`
        );
      }
      reset();
      setIsAuthModalOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.message || "Authentication failed. Please check credentials.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Optional Mode Switch Tabs (only when showTabs is explicitly true, e.g. in small modal) */}
      {showTabs && (
        <div className="flex rounded-2xl bg-muted p-1 mb-4">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setServerError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "login"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setServerError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === "register"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>
      )}

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mode === "register" && (
          <>
            {/* Account Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">I want to join as:</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                    selectedRole === "customer"
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    value="customer"
                    {...register("role")}
                    className="sr-only"
                  />
                  <ShoppingBag className="h-4 w-4" />
                  <span>Customer (Buyer)</span>
                </label>

                <label
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                    selectedRole === "farmer"
                      ? "border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-400 shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    value="farmer"
                    {...register("role")}
                    className="sr-only"
                  />
                  <Tractor className="h-4 w-4" />
                  <span>Farmer (Seller)</span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. Rahim Uddin"
                  className="pl-10 h-11 rounded-xl"
                  {...register("full_name", { required: "Full name is required" })}
                />
              </div>
              {errors.full_name && (
                <p className="text-[11px] font-semibold text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. 01711000000"
                  className="pl-10 h-11 rounded-xl"
                  {...register("phone")}
                />
              </div>
            </div>
          </>
        )}

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="e.g. test2@gmail.com"
              className="pl-10 h-11 rounded-xl"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-semibold text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Enter minimum 8 characters"
              className="pl-10 h-11 rounded-xl"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
          </div>
          {errors.password && (
            <p className="text-[11px] font-semibold text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 font-extrabold rounded-xl shadow-md gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : mode === "login" ? (
            <span>Sign In to Dashboard</span>
          ) : (
            <span>Create {selectedRole === "farmer" ? "Farmer" : "Customer"} Account</span>
          )}
        </Button>
      </form>
    </div>
  );
}
