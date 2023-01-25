import { MySQLClient } from '@wnynya/mysql-client';

import AuthElement from './auth-element.mjs';
import AuthAccount from './auth-account.mjs';
import AuthKey from './auth-key.mjs';
import AuthPermissions from './auth-permissions.mjs';
import AuthSession from './auth-session.mjs';

export { AuthElement, AuthAccount, AuthKey, AuthPermissions, AuthSession };

let MySQL;
function setMySQLClient(o) {
  if (o instanceof MySQLClient) {
    MySQL = o;
  } else {
    MySQL = new MySQLClient(o);
  }
}
export { MySQL, MySQL as mysql, setMySQLClient };

const table = {
  elements: 'auth_elements',
  permissions: 'auth_permissions',
  accounts: 'auth_accounts',
  sessions: 'auth_sessions',
  keys: 'auth_keys',
};
export { table };

import ExpressSession from './mysql/express-middleware-session.mjs';
import ExpressAccount from './mysql/express-middleware-account.mjs';

export default {
  AuthElement,
  AuthAccount,
  AuthKey,
  AuthPermissions,
  AuthSession,
  setMySQLClient: setMySQLClient,
  setPermissionsMap: AuthPermissions.setMap,
  getPermissionsMap: AuthPermissions.getMap,
  session: ExpressSession,
  account: ExpressAccount,
};
