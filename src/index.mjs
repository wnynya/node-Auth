import {
  MySQLAuthElement,
  MySQLAuthPermissions,
  MySQLAuthAccount,
  MySQLAuthSession,
  MysqlAuthKey,
} from './mysql/index.mjs';
import { setMySQLClient } from './mysql/index.mjs';
import ExpressSession from './mysql/express-middleware-session.mjs';
import ExpressAccounts from './mysql/express-middleware-accounts.mjs';

export {
  MySQLAuthElement as MysqlAuthElement,
  MySQLAuthPermissions,
  MySQLAuthAccount,
  MySQLAuthSession,
  MysqlAuthKey,
};

export default {
  session: ExpressSession,
  accounts: ExpressAccounts,
  setMySQLClient: setMySQLClient,
};
