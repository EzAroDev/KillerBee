"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type FormModeleValues = {
  nomModele: string;
  description: string;
  prixHT: string;
  gamme: string;
  dateCreation: string;
};

export default function Page() {
  const router = useRouter();

  const form = useForm<FormModeleValues>({
    defaultValues: {
      nomModele: "",
      description: "",
      prixHT: "",
      gamme: "",
    },
  });

  const onSubmit: SubmitHandler<FormModeleValues> = async (data) => {
    const payload = {
      NomModele: data.nomModele,
      DescriptionModele: data.description,
      PrixUHT: parseFloat(data.prixHT),
      Gamme: data.gamme,
      DateCreation: "2025-03-29", // ou récupérée dynamiquement
    };

    try {
      const res = await api.post("/rd/modele", payload);

      if (res.ok) {
        const json = await res.json();
        toast.success("Modèle créé avec succès !", {
          description: "Redirection vers l'accueil...",
        });
        setTimeout(() => router.push("/home?tab=model"), 2000);
      } else {
        const err = await res.json();
        toast.error("Erreur lors de la création", {
          description: err?.message || "Erreur inconnue",
        });
      }
    } catch (err) {
      toast.error("Erreur réseau ou serveur.");
      // console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0c0d] py-8 px-4 font-primary text-[#f1f1f1]">
      <div className="w-full max-w-2xl bg-[#141516] p-8 shadow-md rounded-xl border border-[#2a2a2a]">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-white hover:text-[#FFD700]"
        >
          ← Retour
        </Button>
        <h1 className="text-3xl font-bold mb-6 text-[#FFD700]">
          Création de modèle
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="nomModele"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du modèle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex : Modèle X"
                      className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez le modèle..."
                      className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prixHT"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix HT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Montant en euros"
                      className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[#999]">
                    Saisir uniquement la valeur numérique.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gamme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gamme</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex : Haute, Basique, etc."
                      className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="dateCreation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de création</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-[#FFD700] text-black hover:bg-yellow-400"
              >
                Créer le modèle
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
