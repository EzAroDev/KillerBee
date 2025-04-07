// import dotenv from 'dotenv';
import { z } from 'zod';

const dotenv = require('dotenv');

if (process.cwd().endsWith('/src')) {
  // process running from src folder
  dotenv.config({ path: '../.env' });
} else {
  dotenv.config();
}

const envSchema = z.object({
  // DB config
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),

  // JWT config
  JWT_SECRET: z.string().default('devSecret'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_SECRET: z.string().default('devRefreshSecret'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // LDAP config
  LDAP_URL: z.string(),
  LDAP_BIND_DN: z.string(),
  LDAP_BIND_PASSWORD: z.string(),
  LDAP_SEARCH_BASE: z.string(),
  LDAP_MOCK: z.string().default('false'),
});

export const env = envSchema.parse(process.env);

// console.log('env:', env);
