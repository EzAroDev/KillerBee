"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  ArrowUpDown,
  CheckCircle2,
  Pencil,
  Plus,
  Rocket,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type Procede = {
  IdProc: string;
  IdModele: string;
  NomProcede: string;
  DescriptionProcede: string;
  ValidationTest: string;
  Auteur: string;
  DateCreation: string;
};

type ProcedeUser = {
  IdProc: string;
  IdModele: string;
  NomProcede: string;
  DescriptionProcede: string;
};

export default function ProcedeTable() {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [procedes, setProcedes] = useState<Procede[]>([]);
  const [sortBy, setSortBy] = useState<keyof Procede>("IdProc");
  const [sortByUser, setSortByUser] = useState<keyof Procede>("IdProc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [procedesUser, setProcedesUser] = useState<ProcedeUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

        if (
          user?.role === "RD" ||
          user?.role === "ADMIN" ||
          user?.role === "TEST"
        ) {
          res = await api.get("/rd/procede");
        } else if (user?.role === "PROD") {
          res = await api.get("/rd/valides");
        } else if (user?.role === "USER") {
          res = await api.get("/prod/procede");
        }

        if (res) {
          const body = await res.clone().text();

          if (res.ok) {
            const data = JSON.parse(body);
            if (user?.role === "USER") {
              setProcedesUser(data);
            } else {
              setProcedes(data);
            }
          } else {
            toast.error("Erreur lors de la récupération des procédés");
          }
        }
      } catch (err) {
        toast.error("Erreur réseau");
        // console.error("Erreur réseau :", err);
      } finally {
        setIsLoading(false); // ✅ NE PAS OUBLIER
      }
    };

    fetchData();
  }, [user]);

  const handleSort = (field: keyof Procede) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const handleSortUser = (field: keyof ProcedeUser) => {
    if (sortByUser === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortByUser(field);
      setSortAsc(true);
    }
  };

  let filtered: Procede[] | ProcedeUser[] = [];
  let paginatedData: Procede[] | ProcedeUser[] = [];

  if (user?.role === "USER") {
    filtered = useMemo(() => {
      const filteredModels = procedesUser.filter((procedesUser) =>
        Object.values(procedesUser)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );

      return filteredModels.sort((a, b) => {
        const aValue =
          sortByUser in a ? (a as Record<string, any>)[sortByUser] : "";
        const bValue =
          sortByUser in b ? (b as Record<string, any>)[sortByUser] : "";

        if (sortByUser === "IdProc") {
          const aNum = parseFloat(aValue as string);
          const bNum = parseFloat(bValue as string);
          return sortAsc ? aNum - bNum : bNum - aNum;
        }

        if (sortByUser === "IdModele") {
          const aNum = parseFloat(aValue as string);
          const bNum = parseFloat(bValue as string);
          return sortAsc ? aNum - bNum : bNum - aNum;
        }

        return sortAsc
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }, [procedesUser, search, sortByUser, sortAsc]);

    paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filtered.slice(startIndex, startIndex + itemsPerPage);
    }, [filtered, currentPage]);
  } else {
    filtered = useMemo(() => {
      const filteredModels = procedes.filter((procede) =>
        Object.values(procede)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );

      return filteredModels.sort((a, b) => {
        const aValue = sortBy in a ? (a as Record<string, any>)[sortBy] : "";
        const bValue = sortBy in b ? (b as Record<string, any>)[sortBy] : "";

        if (sortBy === "IdProc" || sortBy === "IdModele") {
          const aNum = parseFloat(aValue as string);
          const bNum = parseFloat(bValue as string);
          return sortAsc ? aNum - bNum : bNum - aNum;
        }

        return sortAsc
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }, [procedes, search, sortBy, sortAsc]);

    paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filtered.slice(startIndex, startIndex + itemsPerPage);
    }, [filtered, currentPage]);
  }

  if (user?.role === "USER") {
    useEffect(() => {
      setCurrentPage(1);
    }, [search, sortByUser, sortAsc]);
  } else {
    useEffect(() => {
      setCurrentPage(1);
    }, [search, sortBy, sortAsc]);
  }

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await api.delete(`/rd/procede/${id}`);
      if (user?.role === "USER") {
        if (res.ok) {
          setProcedesUser((prev) => prev.filter((m) => m.IdProc !== id));
          toast.success("Procédé supprimé avec succès");
        } else {
          toast.error("Erreur lors de la suppression du procédé");
        }
      } else {
        if (res.ok) {
          setProcedes((prev) => prev.filter((m) => m.IdProc !== id));
          toast.success("Procédé supprimé avec succès");
        } else {
          toast.error("Erreur lors de la suppression du procédé");
        }
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
          <Link href="/formulaire-procede">
            <Button className="bg-[#FFD700] text-black hover:bg-yellow-400">
              <Plus className="mr-2 h-4 w-4" />
              Créer un procédé
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
          {user?.role === "USER" && procedesUser.length > 0 && (
            <div className="w-full overflow-x-auto rounded-md border border-[#2a2a2a]">
              <Table className="min-w-[600px]">
                <TableHeader className="rounded-md">
                  <TableRow>
                    {[
                      ["IdProc", "ID"],
                      ["IdModele", "IDMod"],
                      ["NomProcede", "Nom"],
                      ["DescriptionProcede", "Description"],
                    ].map(([key, label]) => (
                      <TableHead
                        key={key}
                        onClick={() => handleSortUser(key as keyof ProcedeUser)}
                        className="cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1">
                          {label}
                          <ArrowUpDown
                            className={`w-4 h-4 ${
                              sortByUser === key
                                ? "text-[#46453a]"
                                : "text-white"
                            }`}
                          />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-[#0b0c0d]">
                  {paginatedData.map((model) => (
                    <TableRow
                      key={model.IdProc}
                      className="hover:bg-[#141516]/80 transition"
                    >
                      <TableCell>{model.IdProc}</TableCell>
                      <TableCell>{model.IdModele}</TableCell>
                      <TableCell>{model.NomProcede}</TableCell>
                      <TableCell>{model.DescriptionProcede}</TableCell>
                    </TableRow>
                  ))}
                  {paginatedData.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-6 text-[#b0b0b0]"
                      >
                        Aucun Procédé trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {user?.role != "USER" && procedes.length > 0 && (
            <div className="w-full overflow-x-auto rounded-md border border-[#2a2a2a]">
              <Table className="min-w-[600px]">
                <TableHeader className="rounded-md">
                  <TableRow>
                    {[
                      ["IdProc", "ID"],
                      ["IdModele", "IDMod"],
                      ["NomProcede", "Nom"],
                      ["DescriptionProcede", "Description"],
                      ["ValidationTest", "Validation"],
                      ["Auteur", "Auteur"],
                      ["DateCreation", "Date"],
                    ].map(([key, label]) => (
                      <TableHead
                        key={key}
                        onClick={() => handleSort(key as keyof Procede)}
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-[#0b0c0d]">
                  {paginatedData.map((model) => (
                    <TableRow
                      key={model.IdProc}
                      className="hover:bg-[#141516]/80 transition"
                    >
                      <TableCell>{model.IdProc}</TableCell>
                      <TableCell>{model.IdModele}</TableCell>
                      <TableCell>{model.NomProcede}</TableCell>
                      <TableCell>{model.DescriptionProcede}</TableCell>
                      <TableCell>
                        {"ValidationTest" in model && model.ValidationTest ? (
                          <CheckCircle className="text-green-500 w-5 h-5 inline" />
                        ) : (
                          <XCircle className="text-red-500 w-5 h-5 inline" />
                        )}
                      </TableCell>
                      {"Auteur" in model && (
                        <TableCell>{model.Auteur as string}</TableCell>
                      )}
                      <TableCell>
                        {"DateCreation" in model &&
                          new Date(
                            model.DateCreation as string
                          ).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {(user?.role === "RD" || user?.role === "ADMIN") && (
                          <Link href={`/formulaire-procede/${model.IdProc}`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="w-4 h-4 text-white" />
                            </Button>
                          </Link>
                        )}
                        {(user?.role === "RD" || user?.role === "ADMIN") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(model.IdProc)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                        {(user?.role === "TEST" || user?.role === "ADMIN") && (
                          <Link
                            href={`/formulaire-test-procede/${model.IdProc}`}
                          >
                            <Button variant="ghost" size="sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </Button>
                          </Link>
                        )}
                        {(user?.role === "PROD" || user?.role === "ADMIN") && (
                          <Link
                            href={`/formulaire-prod-procede/${model.IdProc}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Rocket className="w-4 h-4 text-yellow-400" />
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedData.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-6 text-[#b0b0b0]"
                      >
                        Aucun Procédé trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

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
