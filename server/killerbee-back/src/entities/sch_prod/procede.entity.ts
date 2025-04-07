import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModeleProd } from './modele.entity';

@Entity({ schema: 'SCH_PROD', name: 'Procede' })
export class ProcedeProd {
  @PrimaryGeneratedColumn()
  IdProc: number;

  @Column()
  IdModele: number;

  @Column()
  NomProcede: string;

  @Column('nvarchar', { length: 'MAX' })
  DescriptionProcede: string;

  // @Column()
  // DateCreation: Date;

  @ManyToOne(() => ModeleProd, (modele) => modele.procedes)
  @JoinColumn({ name: 'IdModele' }) // 👈 obligatoire pour le mapping
  modele: ModeleProd;
}
