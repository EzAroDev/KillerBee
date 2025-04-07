export class UserResponseDto {
  IdUser: number;
  NomUser: string;
  PrenomUser: string;
  EmailUser: string;
  RoleUtilisateur: string;
  LastConnexion?: Date;
  DateCreation: Date;
}
