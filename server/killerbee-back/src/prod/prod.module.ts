import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdController } from './prod.controller';
import { ProdService } from './prod.service';
import { ModeleProd } from 'src/entities/sch_prod/modele.entity';
import { ProcedeProd } from 'src/entities/sch_prod/procede.entity';
import { EtapeProd } from 'src/entities/sch_prod/etape.entity';
import { IngredientProd } from 'src/entities/sch_prod/ingredient.entity';
import { ProcedeIngredientProd } from 'src/entities/sch_prod/procede-ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModeleProd,
      ProcedeProd,
      EtapeProd,
      IngredientProd,
      ProcedeIngredientProd,
    ]),
  ],
  controllers: [ProdController],
  providers: [ProdService],
})
export class ProdModule {}
