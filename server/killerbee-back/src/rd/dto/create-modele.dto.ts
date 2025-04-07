import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateModeleDto {
  @IsString()
  NomModele: string;

  @IsString()
  DescriptionModele: string;

  @IsNumber()
  PrixUHT: number;

  @IsString()
  Gamme: string;

  @IsDateString()
  DateCreation: string;
}
