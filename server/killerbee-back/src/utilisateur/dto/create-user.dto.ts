import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  NomUser: string;

  @IsString()
  PrenomUser: string;

  @IsEmail()
  EmailUser: string;

  @IsOptional()
  @IsString()
  PassWordUser?: string;

  @IsString()
  RoleUtilisateur: string;
}
