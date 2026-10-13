"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/auth-context";
import { toast } from "react-toastify";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();

  // Local state for cart items (starts empty for SSR hydration safety)
  const [cart, setCart] = useState([]);
  const [isGuestCartLoaded, setIsGuestCartLoaded] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Helper to normalize items
  const normalizeItems = useCallback((items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      ...item,
      id: item.product_id || item.id,
      qty: Number(item.quantity || item.qty || 1),
    }));
  }, []);

  // Initialize guest cart from localStorage on mount when not authenticated
  useEffect(() => {
    let ignore = false;

    if (!user) {
      Promise.resolve().then(() => {
        if (ignore) return;
        try {
          const saved = localStorage.getItem("agrotrade_guest_cart");
          if (saved) {
            setCart(normalizeItems(JSON.parse(saved)));
          }
        } catch {
          // ignore
        } finally {
          setIsGuestCartLoaded(true);
        }
      });
    } else {
      Promise.resolve().then(() => {
        if (!ignore) setIsGuestCartLoaded(true);
      });
    }

    return () => {
      ignore = true;
    };
  }, [user, normalizeItems]);

  // Synchronize cart with backend database when user is logged in
  useEffect(() => {
    let ignore = false;

    if (user?.id) {
      // 1. Check if there are any guest items stored locally to sync
      let guestItems = [];
      try {
        const saved = localStorage.getItem("agrotrade_guest_cart");
        if (saved) guestItems = JSON.parse(saved);
      } catch {
        guestItems = [];
      }

      if (guestItems.length > 0) {
        // Sync guest items into user's persistent cart in DB
        api
          .post("/cart/sync", { items: guestItems })
          .then((res) => {
            if (!ignore) {
              localStorage.removeItem("agrotrade_guest_cart");
              if (res.data?.items) {
                setCart(normalizeItems(res.data.items));
              }
            }
          })
          .catch(() => {
            // Fetch directly if sync had issue
            api
              .get("/cart")
              .then((res) => {
                if (!ignore && res.data?.items) {
                  setCart(normalizeItems(res.data.items));
                }
              })
              .catch(() => {});
          });
      } else {
        // Fetch existing persistent cart from database
        api
          .get("/cart")
          .then((res) => {
            if (!ignore && res.data?.items) {
              setCart(normalizeItems(res.data.items));
            }
          })
          .catch((err) => {
            console.error("Cart fetch error:", err);
          });
      }
    }

    return () => {
      ignore = true;
    };
  }, [user, normalizeItems]);

  // Save guest cart to localStorage when not authenticated (only after mounted)
  useEffect(() => {
    if (!user && isGuestCartLoaded) {
      localStorage.setItem("agrotrade_guest_cart", JSON.stringify(cart));
    }
  }, [cart, user, isGuestCartLoaded]);

  // Add to cart - Only shows toast, NEVER opens drawer automatically
  const addToCart = useCallback(
    async (product, quantity = 1) => {
      const pId = product.product_id || product.id;
      const pName = product.name || "Harvest item";

      if (user?.id) {
        try {
          const res = await api.post("/cart", {
            product_id: pId,
            quantity,
          });
          if (res.data?.items) {
            setCart(normalizeItems(res.data.items));
          }
          toast.success(`🌾 Added to cart: ${pName}`);
        } catch (err) {
          console.error("Add to cart error:", err);
          toast.error(err.response?.data?.message || "Failed to add to cart");
        }
      } else {
        // Guest mode
        setCart((prev) => {
          const existing = prev.find((i) => (i.id || i.product_id) === pId);
          if (existing) {
            return prev.map((i) =>
              (i.id || i.product_id) === pId
                ? { ...i, qty: i.qty + quantity }
                : i
            );
          }
          return [...prev, { ...product, id: pId, qty: quantity }];
        });
        toast.success(`🌾 Added to cart: ${pName}`);
      }
    },
    [user, normalizeItems]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (productId, delta) => {
      const existing = cart.find((i) => (i.id || i.product_id) === productId);
      if (!existing) return;

      const newQty = existing.qty + delta;

      if (user?.id) {
        try {
          if (newQty <= 0) {
            const res = await api.delete(`/cart/${productId}`);
            if (res.data?.items) setCart(normalizeItems(res.data.items));
            toast.info("Item removed from cart");
          } else {
            const res = await api.patch(`/cart/${productId}`, {
              quantity: newQty,
            });
            if (res.data?.items) setCart(normalizeItems(res.data.items));
          }
        } catch (err) {
          console.error("Cart update error:", err);
          toast.error("Failed to update item quantity");
        }
      } else {
        // Guest mode
        setCart((prev) =>
          prev
            .map((item) => {
              if ((item.id || item.product_id) === productId) {
                const updatedQty = item.qty + delta;
                return updatedQty > 0 ? { ...item, qty: updatedQty } : null;
              }
              return item;
            })
            .filter(Boolean)
        );
      }
    },
    [cart, user, normalizeItems]
  );

  // Remove single item from cart
  const removeFromCart = useCallback(
    async (productId) => {
      if (user?.id) {
        try {
          const res = await api.delete(`/cart/${productId}`);
          if (res.data?.items) setCart(normalizeItems(res.data.items));
          toast.info("Item removed from cart");
        } catch (err) {
          console.error("Cart remove error:", err);
          toast.error("Failed to remove item");
        }
      } else {
        setCart((prev) =>
          prev.filter((item) => (item.id || item.product_id) !== productId)
        );
        toast.info("Item removed from cart");
      }
    },
    [user, normalizeItems]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (user?.id) {
      try {
        await api.delete("/cart");
        setCart([]);
      } catch (err) {
        console.error("Cart clear error:", err);
      }
    } else {
      setCart([]);
      localStorage.removeItem("agrotrade_guest_cart");
    }
  }, [user]);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.qty || 1),
    0
  );
  const cartCount = cart.reduce((count, item) => count + (item.qty || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastOrder,
        setLastOrder,
        isOrderModalOpen,
        setIsOrderModalOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
