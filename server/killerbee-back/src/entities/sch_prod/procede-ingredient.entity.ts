import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProcedeProd } from './procede.entity';
import { IngredientProd } from './ingredient.entity';

@Entity({ schema: 'SCH_PROD', name: 'ProcedeIngredient' })
export class ProcedeIngredientProd {
  @PrimaryColumn()
  IdProc: number;

  @PrimaryColumn()
  IdIngredient: number;

  @Column()
  Grammage: number;

  @ManyToOne(() => ProcedeProd)
  @JoinColumn({ name: 'IdProc' })
  procede: ProcedeProd;

  @ManyToOne(() => IngredientProd)
  @JoinColumn({ name: 'IdIngredient' })
  ingredient: IngredientProd;
}
