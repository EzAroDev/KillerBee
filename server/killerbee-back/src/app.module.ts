import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { AuthModule } from './auth/auth.module';
import { ProdModule } from './prod/prod.module';
import { RdModule } from './rd/rd.module';

// Middleware
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// Entities
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EtapeProd } from './entities/sch_prod/etape.entity';
import { IngredientProd } from './entities/sch_prod/ingredient.entity';
import { ModeleProd } from './entities/sch_prod/modele.entity';
import { ProcedeIngredientProd } from './entities/sch_prod/procede-ingredient.entity';
import { ProcedeProd } from './entities/sch_prod/procede.entity';
import { EtapeRD } from './entities/sch_rd/etape.entity';
import { IngredientRD } from './entities/sch_rd/ingredient.entity';
import { ModeleRD } from './entities/sch_rd/modele.entity';
import { ProcedeIngredientRD } from './entities/sch_rd/procede-ingredient.entity';
import { ProcedeRD } from './entities/sch_rd/procede.entity';
import { Utilisateur } from './entities/utilisateur.entity';
import { UtilisateurModule } from './utilisateur/utilisateur.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Connexion à SQL Server avec TypeORM
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: false, // true uniquement en dev
      autoLoadEntities: true,
      options: {
        encrypt: false,
      },
    }),

    // Enregistrement des entités
    TypeOrmModule.forFeature([
      Utilisateur,
      ModeleRD,
      IngredientRD,
      ProcedeRD,
      EtapeRD,
      ProcedeIngredientRD,
      ModeleProd,
      IngredientProd,
      ProcedeProd,
      EtapeProd,
      ProcedeIngredientProd,
    ]),

    // Modules métier
    AuthModule,
    RdModule,
    ProdModule,
    UtilisateurModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // middleware global
  }
}
