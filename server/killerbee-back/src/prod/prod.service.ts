import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EtapeProd } from 'src/entities/sch_prod/etape.entity';
import { IngredientProd } from 'src/entities/sch_prod/ingredient.entity';
import { ModeleProd } from 'src/entities/sch_prod/modele.entity';
import { ProcedeIngredientProd } from 'src/entities/sch_prod/procede-ingredient.entity';
import { ProcedeProd } from 'src/entities/sch_prod/procede.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProdService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(ModeleProd)
    private modeleRepo: Repository<ModeleProd>,

    @InjectRepository(ProcedeProd)
    private procedeRepo: Repository<ProcedeProd>,

    @InjectRepository(EtapeProd)
    private etapeRepo: Repository<EtapeProd>,

    @InjectRepository(IngredientProd)
    private ingredientRepo: Repository<IngredientProd>,

    @InjectRepository(ProcedeIngredientProd)
    private procIngrRepo: Repository<ProcedeIngredientProd>,
  ) {}

  async mettreEnProduction(idProc: number) {
    try {
      await this.dataSource.query(
        `EXEC MettreEnProduction @IdProc = ${idProc}`,
      );

      return {
        success: true,
        message: `Procédé ${idProc} mis en production`,
      };
    } catch (error) {
      console.error('[PROD] ❌ Erreur SQL complète :', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        detail: error.detail || '',
      });

      throw new InternalServerErrorException(
        'Erreur pendant la mise en production',
      );
    }
  }

  async getAllModeles(): Promise<ModeleProd[]> {
    return this.modeleRepo.find();
  }

  async getAllProcedes(): Promise<ProcedeProd[]> {
    return this.procedeRepo.find();
  }

  async getModeleById(id: number): Promise<ModeleProd> {
    const modele = await this.modeleRepo.findOneBy({ IdModele: id });
    if (!modele) {
      throw new Error(`ModeleProd with IdModele ${id} not found.`);
    }
    return modele;
  }

  async getProcedesByModele(idModele: number): Promise<ProcedeProd[]> {
    return this.procedeRepo.find({ where: { IdModele: idModele } });
  }

  async getEtapesByProcede(idProc: number): Promise<EtapeProd[]> {
    return this.etapeRepo.find({ where: { IdProc: idProc } });
  }

  async listIngredients() {
    return this.ingredientRepo.find();
  }

  async getIngredientsForProcede(idProc: number) {
    return this.procIngrRepo.find({
      where: { IdProc: idProc },
      relations: ['ingredient'],
    });
  }

  async findOneProcede(id: number) {
    return this.procedeRepo.findOneBy({ IdProc: id });
  }
}
