"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

type Ingredient = { ingredient: string; grammage: string };
type Etape = { numero: number; description: string };
type NewIngredientForm = { nomIngredient: string; description: string };
type FormValues = {
  nomProcede: string;
  modeleAssocie: string;
  auteurProcede: string;
  dateCreation: string;
  descriptionProcede: string;
  ingredients: Ingredient[];
  etapes: Etape[];
  procedeValide: boolean;
};

export default function FormPROD() {
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      nomProcede: "",
      modeleAssocie: "",
      auteurProcede: "",
      dateCreation: new Date().toISOString().split("T")[0],
      descriptionProcede: "",
      ingredients: [],
      etapes: [],
      procedeValide: false,
    },
  });

  const [editModeLines, setEditModeLines] = useState<{
    [key: number]: boolean;
  }>({});

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

  const ingredientForm = useForm<NewIngredientForm>({
    defaultValues: { nomIngredient: "", description: "" },
  });

  const [open, setOpen] = useState(false);
  const [modeles, setModeles] = useState<
    { IdModele: string; NomModele: string }[]
  >([]);
  const [ingredientsList, setIngredientsList] = useState<
    { IdIngredient: string; NomIngredient: string }[]
  >([]);

  const fetchIngredients = async () => {
    const res = await api.get("/rd/ingredient");
    if (res.ok) setIngredientsList(await res.json());
  };

  useEffect(() => {
    const fetchModeles = async () => {
      const res = await api.get("/rd/modele");
      if (res.ok) setModeles(await res.json());
    };

    fetchModeles();
    fetchIngredients();
  }, []);

  // const onSubmitNewIngredient: SubmitHandler<NewIngredientForm> = (
  //   data,
  //   event
  // ) => {
  //   event?.preventDefault();
  //   appendIngredient({ ingredient: data.nomIngredient, grammage: "" });
  //   setOpen(false);
  //   ingredientForm.reset();
  // };

  const SubmitNewIngredient = async (nom: string, description: string) => {
    try {
      if (!nom.trim() || !description.trim()) return;

      const res = await api.post("/rd/ingredient", {
        NomIngredient: nom,
        DescriptionIngredient: description,
      });

      if (res.ok) {
        toast.success("Ingrédient créé avec succès");
        await fetchIngredients(); // ✅ recharge la liste depuis l'API
      } else {
        const error = await res.json();
        toast.error("Erreur lors de la création", {
          description: error?.message || "Erreur inconnue.",
        });
      }

      // appendIngredient({ ingredient: newId, grammage: "" }); // optionnel : Id réel
      // setEditModeLines((prev) => ({ ...prev, [newIndex]: true }));
      ingredientForm.reset();
      setOpen(false);
    } catch (err) {
      console.error("Erreur lors de la création de l'ingrédient", err);
    }
  };

  const handleClick = () => {
    const { nomIngredient, description } = ingredientForm.getValues();
    SubmitNewIngredient(nomIngredient, description);
  };

  const onSubmitProcede: SubmitHandler<FormValues> = async (data) => {
    const payload = {
      NomProcede: data.nomProcede,
      DescriptionProcede: data.descriptionProcede,
      ValidationTest: data.procedeValide,
      Auteur: data.auteurProcede,
      DateCreation: new Date(data.dateCreation).toISOString(),
      IdModele: parseInt(data.modeleAssocie, 10),
    };
    try {
      const res = await api.post("/rd/procede", payload);
      if (!res.ok) throw new Error("Erreur création procédé");
      const { IdProc } = await res.json();
      await Promise.all([
        ...data.etapes.map((e) =>
          api.post(`/rd/procede/${IdProc}/etapes`, {
            NumEtape: e.numero,
            DescriptionEtape: e.description,
          })
        ),
        ...data.ingredients.map((i) =>
          api.post(`/rd/procede/${IdProc}/ingredient`, {
            IdIngredient: parseInt(i.ingredient, 10),
            Grammage: parseInt(i.grammage, 10),
          })
        ),
      ]);
      toast.success("Procédé créé avec succès", {
        description: "Vous allez être redirigé vers l’accueil",
      });

      setTimeout(() => router.push("/home?tab=procede"), 1500);
    } catch (err) {
      // console.error("Erreur lors de la création du procédé", err);
      toast.error("Échec de la création", {
        description: "Une erreur est survenue, réessayez.",
      });
    }
  };

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
          Création de procédé
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitProcede)}
            className="space-y-5"
          >
            {[
              {
                name: "nomProcede",
                label: "Nom du procédé",
                placeholder: "Ex: Création de l'aile du frisbee",
              },
              {
                name: "auteurProcede",
                label: "Auteur du procédé",
                placeholder: "Entrez le nom de l'auteur",
              },
            ].map(({ name, label, placeholder }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof FormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={placeholder}
                        type="test"
                        className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                        value={
                          typeof field.value === "string" ||
                          typeof field.value === "number"
                            ? field.value
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="modeleAssocie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modèle associé</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1]">
                        <SelectValue placeholder="Choisir un modèle existant" />
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
                      className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                      placeholder="Détaillez le but et le déroulement du procédé"
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

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-white border-[#FFD700] hover:bg-[#1f2021]"
                    >
                      + Créer un ingrédient
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="bg-[#141516] text-white border border-[#2a2a2a] rounded-xl">
                    <DialogHeader>
                      <DialogTitle className="text-[#FFD700]">
                        Créer un ingrédient
                      </DialogTitle>
                      <DialogDescription>
                        Renseignez les informations de l’ingrédient :
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...ingredientForm}>
                      <div className="space-y-4 pt-2">
                        <FormField
                          control={ingredientForm.control}
                          name="nomIngredient"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom de l’ingrédient</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex : Polypropylène"
                                  className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={ingredientForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Décrivez rapidement l’ingrédient..."
                                  className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button
                            type="submit"
                            className="bg-[#FFD700] text-black hover:bg-yellow-400"
                            onClick={handleClick}
                          >
                            Créer l’ingrédient
                          </Button>
                        </DialogFooter>
                      </div>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {ingredientFields.map((item, index) => {
                const isEditing = editModeLines[index] ?? false;

                return (
                  <div key={item.id} className="flex gap-2 items-center">
                    {/* Ingrédient (nom ou ID) */}
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.ingredient`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            {isEditing ? (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
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
                                    (ing) => ing.IdIngredient === field.value
                                  )?.NomIngredient || field.value
                                }
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
                              placeholder="Grammage (ex: 150g)"
                              readOnly={!isEditing}
                              disabled={!isEditing}
                              className="bg-[#141516] border-[#2a2a2a] text-[#f1f1f1] placeholder:text-[#777]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const updated = { ...editModeLines };
                          delete updated[index];
                          setEditModeLines(updated);
                          removeIngredient(index);
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  appendIngredient({ ingredient: "", grammage: "" });
                  setEditModeLines((prev) => ({
                    ...prev,
                    [ingredientFields.length]: true,
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
                    numero: etapeFields.length + 1,
                    description: "",
                  })
                }
                className="text-white border-[#FFD700] hover:bg-[#1f2021]"
              >
                + Ajouter une étape
              </Button>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-[#FFD700] text-black hover:bg-yellow-400"
              >
                Créer le procédé
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
