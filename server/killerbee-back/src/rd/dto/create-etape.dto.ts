import { IsString, IsNumber } from 'class-validator';

export class CreateEtapeDto {
  @IsString()
  DescriptionEtape: string;

  @IsNumber()
  NumEtape: number;
}
