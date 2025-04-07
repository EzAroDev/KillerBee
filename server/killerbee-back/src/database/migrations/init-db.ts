import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1700000000000 implements MigrationInterface {
  name = 'InitDb1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE Utilisateur (
        IdUser INT IDENTITY PRIMARY KEY,
        NomUser NVARCHAR(100),
        PrenomUser NVARCHAR(100),
        EmailUser NVARCHAR(100) UNIQUE,
        PassWordUser NVARCHAR(100),
        LastConnexion DATETIME,
        DateCreation DATETIME,
        RoleUtilisateur NVARCHAR(50)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS Utilisateur`);
  }
}
