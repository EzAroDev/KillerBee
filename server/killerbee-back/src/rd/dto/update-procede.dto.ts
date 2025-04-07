import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProcedeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  IdModele: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  NomProcede?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  DescriptionProcede?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Auteur?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ValidationTest?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  DateCreation?: string;
}
