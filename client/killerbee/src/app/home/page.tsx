"use client";

import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { Box, FlaskConical, Workflow } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import IngredientTable from "./components/IngredientTable";
import ModeleTable from "./components/ModeleTable";
import ProcedeTable from "./components/ProcedeTable";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "model" | "ingredient" | "procede"
  >("model");

  useEffect(() => {
    if (
      tabParam === "ingredient" ||
      tabParam === "procede" ||
      tabParam === "model"
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const changeTab = (tab: "model" | "ingredient" | "procede") => {
    router.push(`?tab=${tab}`);
  };

  return (
    <AuthGuard roles={["USER", "ADMIN", "RD", "TEST", "PROD"]}>
      <section className="h-screen flex flex-col bg-[#0b0c0d] text-white">
        <Header />
        <div className="container mx-auto px-4 flex flex-1">
          <aside className="w-64 flex flex-col items-start p-4 gap-4">
            <SidebarButton
              icon={<Box size={24} />}
              label="Modèles"
              active={activeTab === "model"}
              onClick={() => changeTab("model")}
            />
            <SidebarButton
              icon={<FlaskConical size={24} />}
              label="Ingrédients"
              active={activeTab === "ingredient"}
              onClick={() => changeTab("ingredient")}
            />
            <SidebarButton
              icon={<Workflow size={24} />}
              label="Procédés"
              active={activeTab === "procede"}
              onClick={() => changeTab("procede")}
            />
          </aside>

          <main className="flex-1 p-8 overflow-y-auto">
            {activeTab === "model" && <ModeleTable />}
            {activeTab === "ingredient" && <IngredientTable />}
            {activeTab === "procede" && <ProcedeTable />}
          </main>
        </div>
      </section>
    </AuthGuard>
  );
}

function SidebarButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactElement;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = icon.type;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition 
        ${
          active
            ? "bg-[#FFD700] text-black font-semibold"
            : "hover:bg-[#2a2a2a] text-white"
        }
      `}
    >
      <Icon size={24} className={active ? "text-black" : "text-[#FFD700]"} />
      <span>{label}</span>
    </button>
  );
}
