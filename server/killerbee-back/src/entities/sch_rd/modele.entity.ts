import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProcedeRD } from './procede.entity';

@Entity({ schema: 'SCH_RD', name: 'Modele' })
export class ModeleRD {
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

  @OneToMany(() => ProcedeRD, (procede) => procede.modele)
  procedes: ProcedeRD[];
}
