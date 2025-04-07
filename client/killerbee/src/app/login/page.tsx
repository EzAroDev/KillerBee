"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Connexion réussie", {
        description: "Bienvenue sur la plateforme Freezbee",
      });
      router.push("/home");
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setError("");
    try {
      await login(username, password);
    } catch (e: any) {
      setError(e.message || "Erreur de connexion");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0c0d] text-[#f1f1f1]">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-[#141516]">
        <h1 className="text-2xl font-bold text-center text-[#FFD700] mb-6">
          Connexion
        </h1>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#1e1e1f] text-[#f1f1f1]"
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#1e1e1f] text-[#f1f1f1]"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={handleLogin}
            className="w-full bg-[#FFD700] text-black hover:bg-yellow-400"
          >
            Se connecter
          </Button>
        </div>
      </div>
    </main>
  );
}
