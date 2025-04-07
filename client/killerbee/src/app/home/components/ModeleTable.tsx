"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { ArrowUpDown, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Modele = {
  IdModele: string;
  NomModele: string;
  DescriptionModele: string;
  PrixUHT: string;
  Gamme: string;
  DateCreation: string;
};

export default function ModeleTable() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [models, setModels] = useState<Modele[]>([]);
  const [sortBy, setSortBy] = useState<keyof Modele>("IdModele");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const rowHeight = 60; // hauteur approximative d'une ligne en px
      const headerHeight = 300; // header + marges + boutons
      const screenHeight = window.innerHeight;

      const availableHeight = screenHeight - headerHeight;
      const newItemsPerPage = Math.max(
        3,
        Math.floor(availableHeight / rowHeight)
      );

      setItemsPerPage(newItemsPerPage);
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);

    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // ⏳
        let res: Response | null = null;

        if (user?.role === "PROD" || user?.role === "USER") {
          res = await api.get("/prod/modele");
        } else if (
          user?.role === "RD" ||
          user?.role === "ADMIN" ||
          user?.role === "TEST"
        ) {
          res = await api.get("/rd/modele");
        }

        if (res && res.ok) {
          const data = await res.json();
          setModels(data);
        } else if (res) {
          toast.error("Erreur lors de la récupération des modèles");
        }
      } catch (err) {
        toast.error("Erreur réseau");
        // console.error("Erreur réseau :", err);
      } finally {
        setIsLoading(false); // ✅ terminé
      }
    };
    fetchData();
  }, [user]);

  const handleSort = (field: keyof Modele) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc); // toggle
    } else {
      setSortBy(field);
      setSortAsc(true); // default to ascending
    }
  };

  const filtered = useMemo(() => {
    const filteredModels = models.filter((model) =>
      Object.values(model)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    return filteredModels.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortBy === "IdModele") {
        const aNum = parseFloat(aValue as string);
        const bNum = parseFloat(bValue as string);
        return sortAsc ? aNum - bNum : bNum - aNum;
      }

      if (sortBy === "PrixUHT") {
        const aNum = parseFloat(aValue as string);
        const bNum = parseFloat(bValue as string);
        return sortAsc ? aNum - bNum : bNum - aNum;
      }

      if (sortBy === "DateCreation") {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        return sortAsc
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      return sortAsc
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [models, search, sortBy, sortAsc]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, sortAsc]);

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/rd/modele/${id}`);
      if (res.ok) {
        setModels((prev) => prev.filter((m) => m.IdModele !== id));
        toast.success("Ingrédient supprimé avec succès");
      } else {
        toast.error("Erreur lors de la suppression d'un modèle");
      }
    } catch (error) {
      toast.error("Erreur réseau");
      // console.error("Erreur réseau :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Rechercher un modèle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs bg-[#141516] border-[#2a2a2a] text-white placeholder:text-[#777]"
        />
        {(user?.role === "RD" || user?.role === "ADMIN") && (
          <Link href="/formulaire-model">
            <Button className="bg-[#FFD700] text-black hover:bg-yellow-400">
              <Plus className="mr-2 h-4 w-4" />
              Créer un modèle
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-400" />
        </div>
      ) : (
        <div>
          <div className="w-full overflow-x-auto rounded-md border border-[#2a2a2a]">
            <Table className="min-w-[600px]">
              <TableHeader className="rounded-md">
                <TableRow>
                  {[
                    ["IdModele", "ID"],
                    ["NomModele", "Nom"],
                    ["DescriptionModele", "Description"],
                    ["PrixUHT", "Prix (€)"],
                    ["Gamme", "Gamme"],
                    ["DateCreation", "Date"],
                  ].map(([key, label]) => (
                    <TableHead
                      key={key}
                      onClick={() => handleSort(key as keyof Modele)}
                      className="cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        <ArrowUpDown
                          className={`w-4 h-4 ${
                            sortBy === key ? "text-[#46453a]" : "text-white"
                          }`}
                        />
                      </div>
                    </TableHead>
                  ))}
                  {(user?.role === "RD" || user?.role === "ADMIN") && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody className="bg-[#0b0c0d]">
                {paginatedData.map((model) => (
                  <TableRow
                    key={model.IdModele}
                    className="hover:bg-[#141516]/80 transition"
                  >
                    <TableCell>{model.IdModele}</TableCell>
                    <TableCell>{model.NomModele}</TableCell>
                    <TableCell>{model.DescriptionModele}</TableCell>
                    <TableCell>{model.PrixUHT}</TableCell>
                    <TableCell>{model.Gamme}</TableCell>
                    <TableCell>
                      {new Date(model.DateCreation).toLocaleDateString("fr-FR")}
                    </TableCell>
                    {(user?.role === "RD" || user?.role === "ADMIN") && (
                      <TableCell className="text-right space-x-2">
                        <Link href={`/formulaire-model/${model.IdModele}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="w-4 h-4 text-white" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(model.IdModele)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-[#b0b0b0]"
                    >
                      Aucun Modèle trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {paginatedData.length > 0 && (
            <Pagination className="pt-4">
              <PaginationContent className="justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: Math.ceil(filtered.length / itemsPerPage) },
                  (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(filtered.length / itemsPerPage)
                        )
                      )
                    }
                    className={
                      currentPage === Math.ceil(filtered.length / itemsPerPage)
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
