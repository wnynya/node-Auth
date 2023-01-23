import { MySQLClient } from '@wnynya/mysql-client';

import MysqlAuthElement from './auth-element.mjs';
import MySQLAuthPermissions from './auth-permissions.mjs';
import MySQLAuthAccount from './auth-account.mjs';
import MySQLAuthSession from './auth-session.mjs';
import MysqlAuthKey from './auth-key.mjs';

export {
  MysqlAuthElement as MySQLAuthElement,
  MySQLAuthPermissions,
  MySQLAuthAccount,
  MySQLAuthSession,
  MysqlAuthKey,
};

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
