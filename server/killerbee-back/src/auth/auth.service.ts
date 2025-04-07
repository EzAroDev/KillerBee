import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/config/jwt.config';
import { Utilisateur } from 'src/entities/utilisateur.entity';
import { Repository } from 'typeorm';
import { LdapService } from './ldap/ldap.service';

@Injectable()
export class AuthService {
  constructor(
    private ldapService: LdapService,
    private jwtService: JwtService,
    @InjectRepository(Utilisateur)
    private userRepo: Repository<Utilisateur>,
  ) {}

  async validateLogin(username: string, password: string) {
    const ldapUser = await this.ldapService.validateUser(username, password);
    if (!ldapUser) throw new UnauthorizedException();

    const user = await this.userRepo.findOne({
      where: { EmailUser: ldapUser.email },
    });
    if (!user) throw new UnauthorizedException();

    const payload = {
      sub: user.IdUser,
      username: user.NomUser,
      email: user.EmailUser,
      role: user.RoleUtilisateur,
    };

    const tokens = await this.generateTokens(payload);

    // Hash et stocke le refreshToken
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    user.LastConnexion = new Date();
    await this.userRepo.save(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: payload,
    };
  }

  // async validateLogin(username: string, password: string) {
  //   const ldapUser = await this.ldapService.validateUser(username, password);
  //   if (!ldapUser) throw new UnauthorizedException('LDAP credentials invalid');

  //   const user = await this.userRepo.findOne({
  //     where: { EmailUser: ldapUser.email },
  //   });

  //   if (!user) throw new UnauthorizedException('Utilisateur non enregistré');

  //   // 🕒 Mise à jour de la date de dernière connexion
  //   user.LastConnexion = new Date();
  //   await this.userRepo.save(user); // sauvegarde uniquement LastConnexion

  //   const payload = {
  //     sub: user.IdUser,
  //     username: user.NomUser,
  //     email: user.EmailUser,
  //     role: user.RoleUtilisateur,
  //   };

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     user: payload,
  //   };
  // }

  async logout(userId: number) {
    await this.userRepo.update(userId, { refreshToken: null });
    return { success: true, message: 'Déconnecté avec succès' };
  }

  async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.refreshSecret,
      });

      const user = await this.userRepo.findOne({
        where: { IdUser: decoded.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      const isMatch = await bcrypt.compare(token, user.refreshToken);

      if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

      const payload = {
        sub: user.IdUser,
        username: user.NomUser,
        email: user.EmailUser,
        role: user.RoleUtilisateur,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '15m',
      });

      return { accessToken: newAccessToken };
    } catch (err) {
      console.error('[Refresh] Erreur :', err);
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
