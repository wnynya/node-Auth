import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';
import MysqlAuthElement from './auth-element.mjs';
import MySQLAuthAccount from './auth-account.mjs';

export default class MysqlAuthKey extends MySQLClass {
  constructor(element) {
    super(mysql);

    this.element = element;
    this.account = this.element.uid;
    this.expire = new Date(0);

    this.table = table.keys;
    this.schema = {
      element: [
        (uid) => {
          return new MysqlAuthElement(uid);
        },
        (elm) => {
          return elm.uid;
        },
      ],
      account: [
        (uid) => {
          return new MySQLAuthAccount(new MysqlAuthElement(uid));
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
}
