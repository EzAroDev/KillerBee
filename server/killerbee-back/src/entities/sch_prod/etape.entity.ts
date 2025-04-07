import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProcedeProd } from './procede.entity';

@Entity({ schema: 'SCH_PROD', name: 'Etape' })
export class EtapeProd {
  @PrimaryColumn()
  IdEtape: number;

  @Column()
  IdProc: number;

  @Column('nvarchar', { length: 'MAX' })
  DescriptionEtape: string;

  @Column()
  NumEtape: number;

  @ManyToOne(() => ProcedeProd)
  @JoinColumn({ name: 'IdProc' })
  procede: ProcedeProd;
}
