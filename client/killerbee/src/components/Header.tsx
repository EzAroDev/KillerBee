"use client";

import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#1a1a1a] border-b border-[#3A3A3A] text-white shadow-sm py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-3">
          <Image
            src="/assets/bee_alone.svg" // remplace par le bon chemin
            alt="KillerBee logo"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-lg font-bold text-[#FFD700] hidden sm:block">
            KillerBee
          </span>
        </Link>

        <div className="flex items-center gap-5">
          {user && (
            <div className="text-sm sm:text-base text-white/80 font-medium">
              {user.username}
            </div>
          )}
          <Button
            onClick={logout}
            className="bg-[#FFD700] text-black hover:bg-yellow-400 transition"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
