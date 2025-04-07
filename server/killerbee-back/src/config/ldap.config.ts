import { env } from './../env';

export const ldapConfig = {
  url: env.LDAP_URL,
  bindDN: env.LDAP_BIND_DN,
  bindCredentials: env.LDAP_BIND_PASSWORD,
  searchBase: env.LDAP_SEARCH_BASE,
  searchFilter: '(sAMAccountName={{username}})',
};
