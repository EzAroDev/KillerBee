import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0c0d] text-[#f1f1f1] px-4">
      <div className="text-center max-w-md">
        <Ghost className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-[#FFD700] mb-2">
          404 - Page introuvable
        </h1>
        <p className="text-gray-400 mb-6">
          La page que tu cherches n'existe pas ou a été déplacée.
        </p>
        <Link href="/home">
          <Button className="bg-[#FFD700] text-black hover:bg-yellow-400">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
