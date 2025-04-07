export interface UtilisateurProfil {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  lastConnexion?: Date;
}
