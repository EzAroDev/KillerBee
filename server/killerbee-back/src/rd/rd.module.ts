import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapeProd } from 'src/entities/sch_prod/etape.entity';
import { EtapeRD } from 'src/entities/sch_rd/etape.entity';
import { IngredientRD } from 'src/entities/sch_rd/ingredient.entity';
import { ModeleRD } from 'src/entities/sch_rd/modele.entity';
import { ProcedeIngredientRD } from 'src/entities/sch_rd/procede-ingredient.entity';
import { ProcedeRD } from 'src/entities/sch_rd/procede.entity';
import { RdController } from './rd.controller';
import { RdService } from './rd.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModeleRD,
      IngredientRD,
      ProcedeRD,
      EtapeRD,
      EtapeProd,
      ProcedeIngredientRD,
    ]),
  ],
  controllers: [RdController],
  providers: [RdService],
  exports: [RdService],
})
export class RdModule {}
