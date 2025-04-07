import { Injectable } from '@nestjs/common';
import * as ldap from 'ldapjs';
import { ldapConfig } from '../../config/ldap.config';

@Injectable()
export class LdapService {
  async validateUser(username: string, password: string): Promise<any> {
    const useMock = process.env.LDAP_MOCK === 'true';

    if (useMock) {
      // 🔁 MODE SIMULÉ
      if (username === 'dev' && password === 'test') {
        return {
          username,
          email: 'dev@killerbee.local',
        };
      }
      return null;
    }

    // 🔐 MODE LDAP RÉEL
    const client = ldap.createClient({ url: ldapConfig.url });

    const userDN = ldapConfig.bindDN
      ? ldapConfig.bindDN.replace('{{username}}', username)
      : '';

    return new Promise((resolve, reject) => {
      client.bind(userDN, password, (err) => {
        if (err) {
          console.error('[LDAP] Auth failed:', err.message);
          return reject(null);
        }

        // Exemple de retour minimal (à adapter si tu fais une recherche LDAP après)
        return resolve({
          username,
          email: `${username}@killerbee.local`,
        });
      });
    });
  }
}
