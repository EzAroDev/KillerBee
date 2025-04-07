import { IsNumber } from 'class-validator';

export class MiseEnProductionDto {
  @IsNumber()
  IdProc: number;
}
