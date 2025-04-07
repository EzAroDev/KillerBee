import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ schema: 'SCH_PROD', name: 'Ingredient' })
export class IngredientProd {
  @PrimaryColumn()
  IdIngredient: number;

  @Column()
  NomIngredient: string;

  @Column('nvarchar', { length: 'MAX' })
  DescriptionIngredient: string;
}
