"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormModeleValues = {
  nomModele: string;
  description: string;
  prixHT: string;
  gamme: string;
};

export default function UpdateModelePage() {
  const form = useForm<FormModeleValues>({
    defaultValues: {
      nomModele: "",
      description: "",
      prixHT: "",
      gamme: "",
    },
  });

  const router = useRouter();
  const { IdModele } = useParams();

  useEffect(() => {
    const fetchModel = async () => {
      const res = await api.get(`/rd/modele/${IdModele}`);
      if (res.ok) {
        const data = await res.json();
        form.reset({
          nomModele: data.NomModele ?? "",
          description: data.DescriptionModele ?? "",
          prixHT: data.PrixUHT?.toString() ?? "",
          gamme: data.Gamme ?? "",
        });
      } else {
        toast.error("Erreur lors du chargement du modèle.");
      }
    };

    fetchModel();
  }, [IdModele, form]);

  const onSubmit = async (data: FormModeleValues) => {
    const payload = {
      NomModele: data.nomModele,
      DescriptionModele: data.description,
      PrixUHT: parseFloat(data.prixHT),
      Gamme: data.gamme,
    };

    try {
      const res = await api.put(`/rd/modele/${IdModele}`, payload);

      if (res.ok) {
        toast.success("Modèle mis à jour avec succès !", {
          description: "Redirection vers l’accueil...",
        });
        setTimeout(() => router.push("/home?tab=model"), 2000);
      } else {
        const err = await res.json();
        toast.error("Erreur lors de la mise à jour.", {
          description: err.message || "Erreur inconnue.",
        });
      }
    } catch (error) {
      toast.error("Erreur réseau.");
      // console.error("Erreur réseau :", error);
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
          Modifier le modèle
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
                    <Input {...field} />
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
                      {...field}
                      className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
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
                    <Input type="number" {...field} />
                  </FormControl>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-[#FFD700] text-black hover:bg-yellow-400"
            >
              Enregistrer les modifications
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
