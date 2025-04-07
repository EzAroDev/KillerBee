import { Repository } from 'typeorm';
import { Utilisateur } from '../entities/utilisateur.entity';

// TypeORM v0.3+ n’a plus @EntityRepository : crée un provider custom si tu veux faire comme ça
export class UtilisateurRepository extends Repository<Utilisateur> {
  async findActiveByRole(role: string): Promise<Utilisateur[]> {
    return this.createQueryBuilder('user')
      .where('user.RoleUtilisateur = :role', { role })
      .andWhere('user.LastConnexion IS NOT NULL')
      .getMany();
  }
}
