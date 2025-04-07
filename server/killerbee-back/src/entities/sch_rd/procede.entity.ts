import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModeleRD } from './modele.entity';

@Entity({ schema: 'SCH_RD', name: 'Procede' })
export class ProcedeRD {
  @PrimaryGeneratedColumn()
  IdProc: number;

  @Column()
  IdModele: number;

  @Column()
  NomProcede: string;

  @Column('nvarchar', { length: 'MAX' })
  DescriptionProcede: string;

  @Column()
  ValidationTest: boolean;

  @Column()
  Auteur: string;

  @Column()
  DateCreation: Date;

  @ManyToOne(() => ModeleRD, (modele) => modele.procedes)
  @JoinColumn({ name: 'IdModele' }) // 👈 obligatoire pour le mapping
  modele: ModeleRD;
}
