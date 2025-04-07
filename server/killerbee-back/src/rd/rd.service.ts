import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EtapeRD } from 'src/entities/sch_rd/etape.entity';
import { IngredientRD } from 'src/entities/sch_rd/ingredient.entity';
import { ModeleRD } from 'src/entities/sch_rd/modele.entity';
import { ProcedeIngredientRD } from 'src/entities/sch_rd/procede-ingredient.entity';
import { ProcedeRD } from 'src/entities/sch_rd/procede.entity';
import { Repository } from 'typeorm';
import { AddIngredientToProcedeDto } from './dto/add-ingredient-to-procede.dto';
import { CreateEtapeDto } from './dto/create-etape.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { CreateModeleDto } from './dto/create-modele.dto';
import { CreateProcedeDto } from './dto/create-procede.dto';
import { UpdateEtapeDto } from './dto/update-etape.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { UpdateModeleDto } from './dto/update-modele.dto';
import { UpdateProcedeDto } from './dto/update-procede.dto';

@Injectable()
export class RdService {
  constructor(
    @InjectRepository(ModeleRD) private modeleRepo: Repository<ModeleRD>,
    @InjectRepository(ProcedeRD) private procedeRepo: Repository<ProcedeRD>,
    @InjectRepository(EtapeRD) private etapeRepo: Repository<EtapeRD>,
    @InjectRepository(IngredientRD)
    private ingredientRepo: Repository<IngredientRD>,
    @InjectRepository(ProcedeIngredientRD)
    private procIngrRepo: Repository<ProcedeIngredientRD>,
  ) {}

  async createModele(dto: CreateModeleDto) {
    const newModele = this.modeleRepo.create(dto);
    return this.modeleRepo.save(newModele);
  }

  async findAllModeles() {
    return this.modeleRepo.find();
  }

  async findOneModele(id: number) {
    return this.modeleRepo.findOneBy({ IdModele: id });
  }

  async updateModele(id: number, dto: UpdateModeleDto) {
    await this.modeleRepo.update(id, dto);
    return this.findOneModele(id);
  }

  async deleteModele(id: number) {
    const modele = await this.modeleRepo.findOne({
      where: { IdModele: id },
      relations: ['procedes'],
    });

    if (!modele) {
      throw new NotFoundException(`Modèle ${id} introuvable`);
    }

    for (const proc of modele.procedes) {
      // Supprimer les étapes du procédé
      await this.etapeRepo.delete({ IdProc: proc.IdProc });

      // Supprimer les liaisons ingrédient du procédé
      await this.procIngrRepo.delete({ IdProc: proc.IdProc });

      // Supprimer le procédé
      await this.procedeRepo.delete(proc.IdProc);
    }

    // Supprimer enfin le modèle
    await this.modeleRepo.delete(id);

    return { message: `Modèle ${id} et toutes ses dépendances supprimés ✅` };
  }

  async createProcede(dto: CreateProcedeDto) {
    const newProc = this.procedeRepo.create(dto);
    return this.procedeRepo.save(newProc);
  }

  async updateProcede(idProc: number, dto: UpdateProcedeDto) {
    const procede = await this.procedeRepo.findOne({
      where: { IdProc: idProc },
    });

    if (!procede) {
      throw new NotFoundException(`Procédé ${idProc} introuvable`);
    }

    Object.assign(procede, dto);

    return this.procedeRepo.save(procede);
  }

  async findAllProcedes() {
    return this.procedeRepo.find();
  }

  async findOneProcede(id: number) {
    return this.procedeRepo.findOneBy({ IdProc: id });
  }

  async addEtapeToProcede(idProc: number, dto: CreateEtapeDto) {
    try {
      const etape = this.etapeRepo.create({
        ...dto,
        IdProc: idProc,
      });

      const saved = await this.etapeRepo.save(etape);
      return saved;
    } catch (error) {
      console.error('[ETAPE] Erreur complète :', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        detail: error.detail || '',
      });
      throw new InternalServerErrorException({
        message: "Erreur lors de la création d'étape",
        detail: error.message,
      });
    }
  }

  async getEtapesByProcede(idProc: number) {
    return this.etapeRepo.find({
      where: { IdProc: idProc },
      order: { NumEtape: 'ASC' }, // optionnel
    });
  }

  async updateEtape(id: number, dto: Partial<CreateEtapeDto>) {
    const etape = await this.etapeRepo.findOneBy({ IdEtape: id });
    if (!etape) throw new NotFoundException('Étape non trouvée');

    const updated = Object.assign(etape, dto);
    return this.etapeRepo.save(updated);
  }

  async deleteEtape(id: number) {
    const res = await this.etapeRepo.delete({ IdEtape: id });
    if (res.affected === 0) throw new NotFoundException('Étape non trouvée');
    return { message: 'Étape supprimée avec succès' };
  }

  async deleteEtapesByProcede(idProc: number) {
    const proc = await this.procedeRepo.findOne({ where: { IdProc: idProc } });
    if (!proc) {
      throw new NotFoundException(`Procédé ${idProc} introuvable`);
    }

    const result = await this.etapeRepo.delete({ IdProc: idProc });

    return {
      message: `Toutes les étapes du procédé ${idProc} ont été supprimées ✅`,
      affected: result.affected,
    };
  }

  async updateEtapeByProcede(idEtape: number, dto: UpdateEtapeDto) {
    const etape = await this.etapeRepo.findOne({ where: { IdEtape: idEtape } });
    if (!etape) {
      throw new NotFoundException(`Étape ${idEtape} introuvable`);
    }

    Object.assign(etape, dto);
    const updated = await this.etapeRepo.save(etape);

    return {
      message: `Étape ${idEtape} modifiée avec succès ✅`,
      data: updated,
    };
  }

  async validerProcede(idProc: number, isValid: boolean) {
    await this.procedeRepo.update(idProc, { ValidationTest: isValid });
    return this.procedeRepo.findOneBy({ IdProc: idProc });
  }

  async deleteProcede(idProc: number) {
    const proc = await this.procedeRepo.findOne({ where: { IdProc: idProc } });
    if (!proc) {
      throw new NotFoundException(`Procédé ${idProc} introuvable`);
    }

    // Supprimer d'abord les étapes liées
    await this.etapeRepo.delete({ IdProc: idProc });

    // Supprimer les liaisons ingrédient-procédé
    await this.procIngrRepo.delete({ IdProc: idProc });

    // Supprimer le procédé lui-même
    await this.procedeRepo.delete(idProc);

    return { message: `Procédé ${idProc} supprimé avec succès ✅` };
  }

  async createIngredient(dto: CreateIngredientDto) {
    const ingr = this.ingredientRepo.create(dto);
    return this.ingredientRepo.save(ingr);
  }

  async findOneIngredient(id: number) {
    return this.ingredientRepo.findOneBy({ IdIngredient: id });
  }

  async listIngredients() {
    return this.ingredientRepo.find();
  }

  async updateIngredient(id: number, dto: UpdateIngredientDto) {
    const ingr = await this.ingredientRepo.findOne({
      where: { IdIngredient: id },
    });
    if (!ingr) {
      throw new NotFoundException(`Ingrédient ${id} introuvable`);
    }

    Object.assign(ingr, dto);
    const saved = await this.ingredientRepo.save(ingr);

    return {
      message: `Ingrédient ${id} modifié avec succès ✅`,
      data: saved,
    };
  }

  async deleteIngredient(id: number) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { IdIngredient: id },
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingrédient ${id} introuvable`);
    }

    // Supprimer d'abord les liaisons
    await this.procIngrRepo.delete({ IdIngredient: id });

    // Supprimer ensuite l’ingrédient
    await this.ingredientRepo.delete(id);

    return {
      message: `Ingrédient ${id} supprimé avec succès ✅ (et ses liaisons procédés supprimées)`,
    };
  }

  async addIngredientToProcede(idProc: number, dto: AddIngredientToProcedeDto) {
    const link = this.procIngrRepo.create({
      IdProc: idProc,
      IdIngredient: dto.IdIngredient,
      Grammage: dto.Grammage,
    });
    return this.procIngrRepo.save(link);
  }

  async getIngredientsForProcede(idProc: number) {
    return this.procIngrRepo.find({
      where: { IdProc: idProc },
      relations: ['ingredient'],
    });
  }

  async removeIngredientFromProcede(idProc: number, idIngredient: number) {
    return this.procIngrRepo.delete({
      IdProc: idProc,
      IdIngredient: idIngredient,
    });
  }
  async getValidatedProcedes() {
    const result = await this.procedeRepo.find({
      where: { ValidationTest: true },
      relations: ['modele'], // si la relation est bien mappée
    });
    return result;
  }
}
