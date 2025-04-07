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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // ← import du toast

type IngredientFormValues = {
  nomIngredient: string;
  description: string;
};

export default function FormIngredient() {
  const router = useRouter();

  const form = useForm<IngredientFormValues>({
    defaultValues: {
      nomIngredient: "",
      description: "",
    },
  });

  const onSubmit = async (data: IngredientFormValues) => {
    try {
      const res = await api.post("/rd/ingredient", {
        NomIngredient: data.nomIngredient,
        DescriptionIngredient: data.description,
      });

      if (res.ok) {
        toast.success("Ingrédient créé avec succès", {
          description: "Redirection vers l'accueil...",
        });
        setTimeout(() => {
          router.push("/home?tab=ingredient");
        }, 2000);
      } else {
        const error = await res.json();
        toast.error("Erreur lors de la création", {
          description: error?.message || "Erreur inconnue.",
        });
      }
    } catch (err) {
      toast.error("Erreur lors de la requête API");
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
        <h1 className="text-2xl font-bold mb-6 text-[#FFD700]">
          Création d’un ingrédient
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Nom de l’ingrédient */}
            <FormField
              control={form.control}
              name="nomIngredient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l’ingrédient</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex : Polypropylène"
                      className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description de l’ingrédient */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Décrivez rapidement l’ingrédient..."
                      className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bouton de soumission */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-[#FFD700] text-black hover:bg-yellow-400"
              >
                Créer l’ingrédient
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
