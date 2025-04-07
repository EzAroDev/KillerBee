import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from '../env';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  autoLoadEntities: true, // 👈 Ajoute cette option pour éviter d'importer les entités manuellement
  synchronize: true, // ⚠️ Désactive en production
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // ou [User]
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
};
