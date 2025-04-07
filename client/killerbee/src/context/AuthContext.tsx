"use client";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  sub: string;
  email: string;
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const fetchUser = async (token: string) => {
    try {
      const decoded: any = jwtDecode(token);

      if (!decoded || !decoded.role) {
        throw new Error("Token sans rôle");
      }

      setUser(decoded);
    } catch (e) {
      console.error("Erreur de décodage :", e);
      logout();
    }
  };

  const login = async (username: string, password: string) => {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Erreur de connexion");

    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    // Après avoir reçu le token et l'avoir mis dans le localStorage :
    document.cookie = `accessToken=${data.accessToken}; path=/`;

    const decoded = jwtDecode(data.accessToken) as User;
    setUser(decoded);
    router.push("/home");
  };

  const logout = () => {
    localStorage.clear();
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    toast.success("Déconnexion réussie", {
      description: "À bientôt",
    });
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUser(token);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
