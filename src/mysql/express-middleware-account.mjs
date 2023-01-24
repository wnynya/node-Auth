import MySQLAuthKey from './auth-key.mjs';
import { MySQLAuthElement, MySQLAuthPermissions } from './index.mjs';

export default function (options = {}) {
  return async function (req, res, next) {
    !req.p ? (req.p = {}) : null;

    const kid =
      req.headers['Authorization'] ||
      req.headers['O'] ||
      req.query.authorization ||
      req.query.o;

    let account;
    let key;
    let permissions;

    req.login = false;
    req.permissions = [];
    req.hasPermission = (perm) => {
      return MySQLAuthPermissions.hasPermission(req.permissions, perm);
    };

    let kiv = false;
    if (kid) {
      key = new MySQLAuthKey(new MySQLAuthElement(kid));
      await key.select().catch(() => {
        kiv = true;
      });
      if (0 < key.expire && key.expire.getTime() < new Date().getTime()) {
        kiv = true;
      }

      key.element.lastused = new Date();
      await key.element.update(['lastused']);
      account = key.account;
      permissions = key.element.permissions;
    }

    if (!kid || kiv) {
      if (!req.session || !req.session.account) {
        next();
        return;
      }
      account = req.session.account;
      permissions = undefined;
    }

    await account.select().catch(() => {
      next();
      return;
    });

    !permissions ? (permissions = account.element.permissions) : null;

    req.login = true;
    req.permissions = permissions.array;

    req.account = {};
    req.account.uid = account.element.uid;
    req.account.label = account.element.label;
    req.account.eid = account.eid;
    req.account.email = account.email;

    if (key) {
      req.key = {};
      req.key.uid = key.element.uid;
      req.key.label = key.element.label;
    }

    next();
  };
}
