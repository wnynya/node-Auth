import {
  MySQLAuthElement,
  MySQLAuthPermissions,
  MySQLAuthAccount,
  MySQLAuthSession,
  MySQLAuthKey,
} from './mysql/index.mjs';
import { setMySQLClient } from './mysql/index.mjs';
import ExpressSession from './mysql/express-middleware-session.mjs';
import ExpressAccounts from './mysql/express-middleware-accounts.mjs';

export {
  MySQLAuthElement,
  MySQLAuthPermissions,
  MySQLAuthAccount,
  MySQLAuthSession,
  MySQLAuthKey,
};

export default {
  session: ExpressSession,
  accounts: ExpressAccounts,
  setMySQLClient: setMySQLClient,
};
