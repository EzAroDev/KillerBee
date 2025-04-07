import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProcedeProd } from './procede.entity';

@Entity({ schema: 'SCH_PROD', name: 'Modele' })
export class ModeleProd {
  @PrimaryGeneratedColumn()
  IdModele: number;

  @Column()
  NomModele: string;

  @Column('nvarchar', { length: 'MAX' })
  DescriptionModele: string;

  @Column('decimal', { precision: 10, scale: 2 })
  PrixUHT: number;

  @Column()
  Gamme: string;

  @Column()
  DateCreation: Date;

  @OneToMany(() => ProcedeProd, (procede) => procede.modele)
  procedes: ProcedeProd[];
}
