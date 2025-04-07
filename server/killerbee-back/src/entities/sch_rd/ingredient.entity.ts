import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'SCH_RD', name: 'Ingredient' })
export class IngredientRD {
  @PrimaryGeneratedColumn()
  IdIngredient: number;

  @Column()
  NomIngredient: string;

  @Column('nvarchar', { length: 'MAX' })
  DescriptionIngredient: string;
}
