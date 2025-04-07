import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateModeleDto {
  @IsOptional()
  @IsString()
  NomModele?: string;

  @IsOptional()
  @IsString()
  DescriptionModele?: string;

  @IsOptional()
  @IsNumber()
  PrixUHT?: number;

  @IsOptional()
  @IsString()
  Gamme?: string;
}
