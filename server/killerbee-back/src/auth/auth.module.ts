import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LdapService } from './ldap/ldap.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/config/jwt.config';
import { Utilisateur } from 'src/entities/utilisateur.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([Utilisateur]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LdapService],
})
export class AuthModule {}
