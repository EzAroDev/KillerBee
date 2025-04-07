import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateValidationDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  ValidationTest: boolean;
}
