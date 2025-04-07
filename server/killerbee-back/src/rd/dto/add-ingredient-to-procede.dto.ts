import { IsInt } from 'class-validator';

export class AddIngredientToProcedeDto {
  @IsInt()
  IdIngredient: number;

  @IsInt()
  Grammage: number;
}
