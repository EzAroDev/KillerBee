import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Utilisateur')
export class Utilisateur {
  @PrimaryGeneratedColumn()
  IdUser: number;

  @Column({ type: 'nvarchar', length: 100 })
  NomUser: string;

  @Column({ type: 'nvarchar', length: 100 })
  PrenomUser: string;

  @Column({ type: 'nvarchar', length: 100, unique: true })
  EmailUser: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  PassWordUser: string; // Peut être inutilisé si uniquement LDAP

  @Column({ type: 'datetime', nullable: true })
  LastConnexion: Date;

  @Column({ type: 'datetime' })
  DateCreation: Date;

  @Column({ type: 'nvarchar', length: 50 })
  RoleUtilisateur: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  refreshToken: string | null;
}
