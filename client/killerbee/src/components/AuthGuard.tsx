"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  roles?: string[];
};

export default function AuthGuard({ children, roles }: Props) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user && !isAuthenticated) {
      router.push("/login");
    } else if (roles && !roles.includes(user?.role ?? "")) {
      router.push("/unauthorized");
    } else {
      setChecked(true);
    }
  }, [user, isAuthenticated, roles, router]);

  if (!checked) return <p className="h-screen bg-[#0b0c0d]"></p>;

  return <>{children}</>;
}
