import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIngredientDto {
  @ApiPropertyOptional({ example: 'Acide chlorhydrique' })
  @IsOptional()
  @IsString()
  NomIngredient?: string;

  @ApiPropertyOptional({ example: 'Agent nettoyant puissant' })
  @IsOptional()
  @IsString()
  DescriptionIngredient?: string;
}
