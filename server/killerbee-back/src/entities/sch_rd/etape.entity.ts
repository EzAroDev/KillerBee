import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcedeRD } from './procede.entity';

@Entity({ schema: 'SCH_RD', name: 'Etape' })
export class EtapeRD {
  @PrimaryGeneratedColumn()
  IdEtape: number;

  @Column()
  IdProc: number;

  @Column('nvarchar', { length: 'MAX' })
  DescriptionEtape: string;

  @Column()
  NumEtape: number;

  @ManyToOne(() => ProcedeRD)
  @JoinColumn({ name: 'IdProc' })
  procede: ProcedeRD;
}
