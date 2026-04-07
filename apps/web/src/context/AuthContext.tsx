/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, setStoredToken, getStoredToken } from "@/lib/api";
import { redirectPathForRole } from "@/lib/format";
import type { User } from "@/types";

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "provider";
  providerProfile?: {
    businessName: string;
    documentNumber: string;
    city: string;
    state: string;
    vehicleType: string;
    vehiclePlate: string;
    serviceRadiusKm: number;
  };
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      return;
    }

    api.me()
      .then((profile) => setUser(profile))
      .catch(() => {
        setStoredToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAuthResult = useCallback(async (result: { token: string; user: User }) => {
    setStoredToken(result.token);
    setUser(result.user);
    return redirectPathForRole(result.user.role);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password);
    return handleAuthResult(result);
  }, [handleAuthResult]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await api.register(payload);
    return handleAuthResult(result);
  }, [handleAuthResult]);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await api.me();
    setUser(profile);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
