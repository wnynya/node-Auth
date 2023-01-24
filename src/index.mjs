import {
  MySQLAuthElement,
  MySQLAuthPermissions,
  MySQLAuthAccount,
  MySQLAuthSession,
  MySQLAuthKey,
} from './mysql/index.mjs';
import { setMySQLClient } from './mysql/index.mjs';
import ExpressSession from './mysql/express-middleware-session.mjs';
import ExpressAccount from './mysql/express-middleware-account.mjs';

export {
  MySQLAuthElement,
  MySQLAuthPermissions,
  MySQLAuthAccount,
  MySQLAuthSession,
  MySQLAuthKey,
};

export default {
  MySQLAuthElement,
  MySQLAuthPermissions,
  MySQLAuthAccount,
  MySQLAuthSession,
  MySQLAuthKey,
  session: ExpressSession,
  account: ExpressAccount,
  setMySQLClient: setMySQLClient,
  setPermissionsMap: MySQLAuthPermissions.setMap,
  getPermissionsMap: MySQLAuthPermissions.getMap,
};
