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
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api"; // 👈 ton client fetch sécurisé
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Ingredient = {
  ingredient: number;
  grammage: number;
};

type Etape = { idetape: number; numero: number; description: string };

type FormValues = {
  nomProcede: string;
  modeleAssocie: number;
  auteurProcede: string;
  descriptionProcede: string;
  procedeValide: boolean;
  ingredients: Ingredient[];
  etapes: Etape[];
};

export default function FormulaireProductionProcede() {
  const router = useRouter();

  const { id } = useParams();

  const { user } = useAuth();

  const [validated, setValidated] = useState(false);
  const [refused, setRefused] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [commentaire, setCommentaire] = useState("");

  const form = useForm<FormValues>({
    defaultValues: {
      nomProcede: "",
      modeleAssocie: NaN,
      auteurProcede: "",
      descriptionProcede: "",
      procedeValide: false,
      ingredients: [],
      etapes: [],
    },
  });

  const [modeles, setModeles] = useState<
    { IdModele: string; NomModele: string }[]
  >([]);
  const [ingredientsList, setIngredientsList] = useState<
    { IdIngredient: string; NomIngredient: string }[]
  >([]);

  const [etapeList, setetapeList] = useState<
    { IdIngredient: number; NomIngredient: string; description: string }[]
  >([]);

  const [ingredientProcList, setingredientProcList] = useState<
    { IdIngredient: number; NomIngredient: number; Grammage: number }[]
  >([]);

  const handleMiseEnProduction = async () => {
    try {
      const res = await api.post(`/prod/mettre-en-production/${id}`, {});
      if (res.ok) {
        toast.success("Mise en production réussie !");
        setTimeout(() => router.push("/home?tab=procede"), 2000);
      } else {
        toast.error("Échec de la mise en production.");
      }
    } catch (error) {
      toast.error("Erreur réseau lors de la mise en production.");
      // console.error(error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const [modRes, ingRes, procRes, etapeRes, ingProcRes] = await Promise.all(
        [
          api.get("/rd/modele"),
          api.get("/rd/ingredient"),
          api.get(`/rd/procede/${id}`),
          api.get(`/rd/procede/${id}/etapes`),
          api.get(`/rd/procede/${id}/ingredient`),
        ]
      );

      const [modData, ingData, procData, etapeData, ingProcData] =
        await Promise.all([
          modRes.ok ? modRes.json() : [],
          ingRes.ok ? ingRes.json() : [],
          procRes.ok ? procRes.json() : null,
          etapeRes.ok ? etapeRes.json() : [],
          ingProcRes.ok ? ingProcRes.json() : [],
        ]);

      if (modRes.ok) setModeles(modData);
      if (ingRes.ok) setIngredientsList(ingData);
      if (etapeRes.ok) setetapeList(etapeData);
      if (ingProcRes.ok) setingredientProcList(ingProcData);

      if (procRes.ok && procData) {
        form.reset({
          nomProcede: procData.NomProcede ?? "",
          modeleAssocie: parseInt(procData.IdModele ?? NaN),
          auteurProcede: procData.Auteur ?? "",
          descriptionProcede: procData.DescriptionProcede ?? "",
          procedeValide: !!procData.ValidationTest,
          ingredients: ingProcData.map((ing: any) => ({
            ingredient: parseInt(ing.IdIngredient, 10),
            grammage: parseInt(ing.Grammage, 10),
          })),
          etapes: etapeData.map((etape: any) => ({
            numero: etape.NumEtape,
            description: etape.DescriptionEtape,
          })),
        });
      }
    };

    fetchAll();
  }, [id, form]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0c0d] py-8 px-4 font-primary text-[#f1f1f1]">
      <div className="w-full max-w-3xl bg-[#141516] p-8 shadow-md rounded-xl border border-[#2a2a2a]">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-white hover:text-[#FFD700]"
        >
          ← Retour
        </Button>
        <h1 className="text-3xl font-bold mb-6 text-[#FFD700]">
          Détails du procédé
        </h1>

        <Form {...form}>
          <form className="space-y-5">
            <FormField
              control={form.control}
              name="nomProcede"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du procédé</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      readOnly
                      className="bg-[#1e1f20] text-gray-400 border-[#2a2a2a]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modeleAssocie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modèle associé</FormLabel>
                  <FormControl>
                    <Input
                      value={
                        isNaN(Number(field.value)) ? "" : String(field.value)
                      }
                      disabled
                      readOnly
                      className="bg-[#1e1f20] text-gray-400 border-[#2a2a2a]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auteurProcede"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auteur du procédé</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      readOnly
                      className="bg-[#1e1f20] text-gray-400 border-[#2a2a2a]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionProcede"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description du procédé</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled
                      readOnly
                      className="bg-[#1e1f20] text-gray-400 border-[#2a2a2a]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#FFD700]">
                  Ingrédients
                </h2>
              </div>
              {ingredientProcList.map((item, index) => (
                <div
                  key={item.IdIngredient || index}
                  className="flex gap-2 items-center"
                >
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.ingredient`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Nom d'Ingrédient</FormLabel>
                        <FormControl>
                          <Input
                            value={
                              isNaN(Number(field.value))
                                ? ""
                                : String(
                                    ingredientsList.find(
                                      (ing) =>
                                        String(ing.IdIngredient) ===
                                        String(field.value)
                                    )?.NomIngredient || ""
                                  )
                            }
                            disabled
                            className="bg-[#1e1f20] text-gray-400 border-[#2a2a2a]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.grammage`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Grammage</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={
                              isNaN(Number(field.value))
                                ? ""
                                : String(field.value)
                            }
                            readOnly
                            disabled
                            className="bg-[#1e1f20] text-gray-400 border-[#2a2a2a]"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4 mt-6">
              <h2 className="text-lg font-semibold text-[#FFD700]">Étapes</h2>
              {etapeList.map((item, index) => (
                <div
                  key={item.IdIngredient || index}
                  className="flex flex-col sm:flex-row items-center gap-4"
                >
                  <FormField
                    control={form.control}
                    name={`etapes.${index}.numero`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormControl>
                          <Input
                            type="number"
                            value={
                              isNaN(Number(field.value))
                                ? ""
                                : String(field.value)
                            }
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            readOnly
                            disabled
                            className="bg-[#1e1f20] text-gray-400 border-[#2a2a2a]"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`etapes.${index}.description`}
                    disabled
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Description de l'étape"
                            className="bg-[#1e1f20] border-[#2a2a2a] text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={handleMiseEnProduction}
                className="bg-[#FFD700] text-black hover:bg-yellow-400"
              >
                Mettre en production
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
