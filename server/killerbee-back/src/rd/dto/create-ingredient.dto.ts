import { IsString, IsInt } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  NomIngredient: string;

  @IsString()
  DescriptionIngredient: string;
}
