import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEtapeDto {
  @ApiPropertyOptional({ example: 'Nouveau test qualité' })
  @IsOptional()
  @IsString()
  DescriptionEtape?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  NumEtape?: number;
}
