"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("agrotrade_token");
      localStorage.removeItem("agrotrade_user");
    }
    setUser(null);
  }, []);

  useEffect(() => {
    let ignore = false;

    Promise.resolve().then(() => {
      if (ignore) return;
      try {
        const storedUser = localStorage.getItem("agrotrade_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // ignore
      }
    });

    const storedToken = localStorage.getItem("agrotrade_token");
    if (storedToken) {
      api.get("/auth/me")
        .then((res) => {
          if (!ignore && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem("agrotrade_user", JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          if (!ignore) logout();
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    } else {
      Promise.resolve().then(() => {
        if (!ignore) setLoading(false);
      });
    }

    return () => {
      ignore = true;
    };
  }, [logout]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: loggedUser } = res.data;
    localStorage.setItem("agrotrade_token", token);
    localStorage.setItem("agrotrade_user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    const { token, user: registeredUser } = res.data;
    localStorage.setItem("agrotrade_token", token);
    localStorage.setItem("agrotrade_user", JSON.stringify(registeredUser));
    setUser(registeredUser);
    return registeredUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
