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

export type IngredientFormValues = {
  nomIngredient: string;
  description: string;
};

export default function UpdateIngredientForm() {
  const router = useRouter();
  const { IdIngredient } = useParams();

  const form = useForm<IngredientFormValues>({
    defaultValues: {
      nomIngredient: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchIngredient = async () => {
      const res = await api.get(`/rd/ingredient/${IdIngredient}`);
      if (res.ok) {
        const data = await res.json();
        form.reset({
          nomIngredient: data.NomIngredient ?? "",
          description: data.DescriptionIngredient ?? "",
        });
      } else {
        toast.error("Erreur lors de la récupération de l'ingrédient.");
      }
    };

    fetchIngredient();
  }, [IdIngredient, form]);

  const onSubmit = async (data: IngredientFormValues) => {
    const payload = {
      NomIngredient: data.nomIngredient,
      DescriptionIngredient: data.description,
    };

    const res = await api.put(`/rd/ingredient/${IdIngredient}`, payload);

    try {
      const res = await api.put(`/rd/ingredient/${IdIngredient}`, payload);

      if (res.ok) {
        toast.success("Ingrédient mis à jour avec succès !", {
          description: "Redirection en cours...",
        });
        setTimeout(() => {
          router.push("/home?tab=ingredient");
        }, 2000);
      } else {
        const err = await res.json();
        toast.error("Erreur lors de la mise à jour.", {
          description: err.message || "Erreur inconnue.",
        });
      }
    } catch (err) {
      toast.error("Erreur réseau lors de la mise à jour.");
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
          Mise à jour d’un ingrédient
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="nomIngredient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l’ingrédient</FormLabel>
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

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-[#FFD700] text-black hover:bg-yellow-400"
              >
                Mettre à jour
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
