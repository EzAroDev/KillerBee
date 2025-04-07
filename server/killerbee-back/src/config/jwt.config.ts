import { env } from '../env';

export const jwtConstants = {
  secret: env.JWT_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,
  refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  expiresIn: env.JWT_EXPIRES_IN,
};
