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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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

export default function UpdateProcedePage() {
  const { IdProc } = useParams();
  const router = useRouter();
  const [editModeLines, setEditModeLines] = useState<{
    [key: number]: boolean;
  }>({});

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

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ name: "ingredients", control: form.control });

  const {
    fields: etapeFields,
    append: appendEtape,
    remove: removeEtape,
  } = useFieldArray({ name: "etapes", control: form.control });

  const [modeles, setModeles] = useState<
    { IdModele: string; NomModele: string }[]
  >([]);
  const [ingredientsList, setIngredientsList] = useState<
    { IdIngredient: string; NomIngredient: string }[]
  >([]);

  const [etapeList, setetapeList] = useState<
    { IdIngredient: string; NomIngredient: string }[]
  >([]);

  const [ingredientProcList, setingredientProcList] = useState<
    { IdIngredient: number; NomIngredient: string }[]
  >([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [modRes, ingRes, procRes, etapeRes, ingProcRes] = await Promise.all(
        [
          api.get("/rd/modele"),
          api.get("/rd/ingredient"),
          api.get(`/rd/procede/${IdProc}`),
          api.get(`/rd/procede/${IdProc}/etapes`),
          api.get(`/rd/procede/${IdProc}/ingredient`),
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
  }, [IdProc, form]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      NomProcede: data.nomProcede,
      DescriptionProcede: data.descriptionProcede,
      ValidationTest: false,
      Auteur: data.auteurProcede,
      IdModele: parseInt(String(data.modeleAssocie), 10),
      DateCreation: "2025-03-29", // à adapter si besoin
    };

    try {
      const res = await api.put(`/rd/procede/${IdProc}`, payload);
      if (!res.ok) throw new Error("Erreur update procédé");

      // Suppression des anciennes données
      await Promise.all([
        ...ingredientProcList.map((i) =>
          api.delete(`/rd/procede/${IdProc}/ingredient/${i.IdIngredient}`)
        ),
        api.delete(`/rd/procede/${IdProc}/etapes`),
      ]);

      // Réinsertion des nouvelles données
      await Promise.all([
        ...data.ingredients.map((i) =>
          api.post(`/rd/procede/${IdProc}/ingredient`, {
            IdIngredient: parseInt(String(i.ingredient), 10),
            Grammage: parseInt(String(i.grammage), 10),
          })
        ),
        ...data.etapes.map((etape) =>
          api.post(`/rd/procede/${IdProc}/etapes`, {
            NumEtape: etape.numero,
            DescriptionEtape: etape.description,
          })
        ),
      ]);

      toast.success("Procédé mis à jour avec succès", {
        description: "Les données ont été enregistrées.",
      });

      router.push("/home?tab=procede");
    } catch (err) {
      // console.error("Erreur mise à jour :", err);
      toast.error("Échec de la mise à jour", {
        description: "Une erreur s’est produite lors de la mise à jour.",
      });
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-[#0b0c0d] py-8 px-4 text-[#f1f1f1]">
      <div className="w-full max-w-3xl bg-[#141516] p-8 rounded-xl border border-[#2a2a2a]">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-white hover:text-[#FFD700]"
        >
          ← Retour
        </Button>
        <h1 className="text-3xl font-bold mb-6 text-[#FFD700]">
          Modifier un procédé
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nomProcede"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du procédé</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-[#141516] border-[#2a2a2a]"
                    />
                  </FormControl>
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
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-[#141516] border-[#2a2a2a]">
                        <SelectValue placeholder="Sélectionner un modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        {modeles.map((m) => (
                          <SelectItem
                            key={m.IdModele}
                            value={String(m.IdModele)}
                          >
                            {m.NomModele}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auteurProcede"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auteur</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-[#141516] border-[#2a2a2a]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionProcede"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-[#141516] border-[#2a2a2a]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#FFD700]">
                  Ingrédients
                </h2>
              </div>

              {ingredientFields.map((item, index) => {
                const isEditing = editModeLines[index] ?? false;

                return (
                  <div key={item.id} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.ingredient`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            {isEditing ? (
                              <Select
                                onValueChange={field.onChange}
                                value={String(field.value)}
                              >
                                <SelectTrigger className="w-full bg-[#141516] border-[#2a2a2a] text-white">
                                  <SelectValue placeholder="Choisir ingrédient" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ingredientsList.map((ing) => (
                                    <SelectItem
                                      key={ing.IdIngredient}
                                      value={String(ing.IdIngredient)}
                                    >
                                      {ing.NomIngredient}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={
                                  ingredientsList.find(
                                    (ing) =>
                                      String(ing.IdIngredient) ===
                                      String(field.value)
                                  )?.NomIngredient || field.value
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                                readOnly
                                disabled
                                className="bg-[#1e1f20] text-gray-400 border-[#2a2a2a]"
                              />
                            )}
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
                          <FormControl>
                            <Input
                              type="number"
                              value={
                                isNaN(Number(field.value))
                                  ? ""
                                  : Number(field.value)
                              }
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              placeholder="Grammage (ex: 150g)"
                              readOnly={!isEditing}
                              disabled={!isEditing}
                              className={`${
                                isEditing
                                  ? "bg-[#141516] text-white"
                                  : "bg-[#1e1f20] text-gray-400"
                              } border-[#2a2a2a]`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setEditModeLines((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        className={
                          isEditing
                            ? "text-green-400 border-green-400"
                            : "text-[#FFD700] border-[#FFD700]"
                        }
                      >
                        {isEditing ? "✅" : "✏️"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          removeIngredient(index);

                          setEditModeLines((prev) => {
                            const updated: { [key: number]: boolean } = {};

                            for (const [key, value] of Object.entries(prev)) {
                              const k = parseInt(key, 10);
                              if (k < index) {
                                updated[k] = value;
                              } else if (k > index) {
                                updated[k - 1] = value;
                              }
                            }

                            return updated;
                          });
                        }}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  appendIngredient({ ingredient: NaN, grammage: NaN });
                  setEditModeLines((prev) => ({
                    ...prev,
                    [ingredientFields.length]: true, // active le mode édition sur la nouvelle ligne
                  }));
                }}
                className="text-white border-[#FFD700] hover:bg-[#1f2021]"
              >
                + Ajouter un ingrédient
              </Button>
            </div>

            <div className="space-y-4 mt-6">
              <h2 className="text-lg font-semibold text-[#FFD700]">Étapes</h2>
              {etapeFields.map((item, index) => (
                <div
                  key={item.id}
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
                            placeholder="N°"
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
                    name={`etapes.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Description de l'étape"
                            className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => removeEtape(index)}
                    aria-label="Supprimer étape"
                  >
                    ✕
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendEtape({
                    idetape: NaN,
                    numero: etapeFields.length + 1,
                    description: "",
                  })
                }
                className="text-white border-[#FFD700] hover:bg-[#1f2021]"
              >
                + Ajouter une étape
              </Button>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="bg-[#FFD700] text-black hover:bg-yellow-400"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
