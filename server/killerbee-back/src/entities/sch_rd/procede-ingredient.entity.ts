import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProcedeRD } from './procede.entity';
import { IngredientRD } from './ingredient.entity';

@Entity({ schema: 'SCH_RD', name: 'ProcedeIngredient' })
export class ProcedeIngredientRD {
  @PrimaryColumn()
  IdProc: number;

  @PrimaryColumn()
  IdIngredient: number;

  @Column()
  Grammage: number;

  @ManyToOne(() => ProcedeRD)
  @JoinColumn({ name: 'IdProc' })
  procede: ProcedeRD;

  @ManyToOne(() => IngredientRD)
  @JoinColumn({ name: 'IdIngredient' })
  ingredient: IngredientRD;
}
