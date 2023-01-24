import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';
import MySQLAuthElement from './auth-element.mjs';
import MySQLAuthAccount from './auth-account.mjs';

export default class MySQLAuthKey extends MySQLClass {
  constructor(element) {
    super(mysql);

    this.element = element;
    this.account = this.element.uid;
    this.expire = new Date(0);

    this.table = table.keys;
    this.schema = {
      element: [
        (uid) => {
          return new MySQLAuthElement(uid);
        },
        (elm) => {
          return elm.uid;
        },
      ],
      account: [
        (uid) => {
          return new MySQLAuthAccount(new MySQLAuthElement(uid));
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
  }

  async update(parts) {
    await this.element.update(parts);
    await this.updateQuery(parts);
  }

  async delete() {
    await this.deleteQuery();
  }

  toJSON() {
    return {
      uid: this.element.uid,
      label: this.element.label,
      creation: this.element.creation.getTime(),
      lastused: this.element.lastused.getTime(),
      expire: this.expire.getTime(),
      permissions: this.element.permissions.array,
    };
  }
}
