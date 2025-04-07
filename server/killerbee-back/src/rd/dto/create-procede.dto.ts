import { IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class CreateProcedeDto {
  @IsNumber()
  IdModele: number;

  @IsString()
  NomProcede: string;

  @IsString()
  DescriptionProcede: string;

  @IsBoolean()
  ValidationTest: boolean;

  @IsString()
  Auteur: string;

  @IsDateString()
  DateCreation: string;
}
