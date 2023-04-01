import Crypto from '@wnynya/crypto';
import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';
import AuthElement from './auth-element.mjs';
import AuthAccount from './auth-account.mjs';

export default class AuthKey extends MySQLClass {
  constructor(element) {
    super(mysql);

    this.element = element;
    this.code = Crypto.randomString(42);
    this.account = this.element.uid;
    this.expire = new Date(0);

    this.table = table.keys;
    this.schema = {
      element: [
        (uid) => {
          return new AuthElement(uid);
        },
        (elm) => {
          return elm.uid;
        },
      ],
      code: 'string',
      account: [
        (uid) => {
          return new AuthAccount(new AuthElement(uid));
        },
        (acn) => {
          return acn.element.uid;
        },
      ],
      expire: 'date',
    };
    this.filter = { element: this.element.uid };

    this.element.label = '새로운 키';
  }

  async insert() {
    await this.element.insert();
    await this.insertQuery();
  }

  async select(parts = '*') {
    await this.selectQuery(parts);
    await this.element.select(parts);
    await this.account.select(parts);
  }

  async update(parts) {
    await this.element.update(parts);
    await this.updateQuery(parts);
  }

  toJSON() {
    return {
      uid: this.element.uid,
      code: this.code,
      label: this.element.label,
      creation: this.element.creation.getTime(),
      lastused: this.element.lastused.getTime(),
      expire: this.expire.getTime(),
      permissions: this.element.permissions.array,
    };
  }

  async delete() {
    await this.deleteQuery();
  }

  async safe() {
    await this.select(['array']);
    await this.account.select(['array']);
    let changed = false;
    const kperms = this.element.permissions.array;
    for (const perm of kperms) {
      if (!this.account.element.permissions.has(perm)) {
        changed = true;
        kperms.splice(kperms.indexOf(perm), 1);
      }
    }
    if (changed) {
      this.element.permissions.array = kperms;
      await this.element.permissions.update(['array']);
    }
  }

  static async code(string) {
    const res = await mysql.query({
      statement: 'SELECT',
      table: table.keys,
      imports: {
        element: 'string',
      },
      filter: {
        code: string,
      },
      single: true,
    });

    const uid = res.element;

    if (!uid) {
      throw 'default404';
    }

    const key = new AuthKey(new AuthElement(uid));

    await key.select();

    return key;
  }
}
