import * as fs from 'fs';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProcedure1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(
      path.join(__dirname, '../sql/MettreEnProduction.sql'),
      'utf8',
    );
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP PROCEDURE IF EXISTS MettreEnProduction`);
  }
}
