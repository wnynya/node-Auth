import Crypto from '@wnynya/crypto';
import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';
import MysqlAuthElement from './auth-element.mjs';
import MysqlAuthKey from './auth-key.mjs';

export default class MySQLAuthAccount extends MySQLClass {
  constructor(element) {
    super(mysql);

    this.element = element;
    this.eid = this.element.uid;
    this.email = '';
    this.hash = new Crypto().hash();
    this.salt = new Crypto().hash();
    this.phone = '';
    this.meta = {};

    this.table = table.accounts;
    this.schema = {
      element: [
        (uid) => {
          return new MysqlAuthElement(uid);
        },
        (elm) => {
          return elm.uid;
        },
      ],
      eid: 'string',
      email: 'string',
      salt: 'string',
      hash: 'string',
      phone: 'string',
      meta: 'object',
    };
    this.filter = { element: this.element.uid };

    this.element.label = '이름없음';
  }

  async insert(password) {
    await this.element.insert();
    this.salt = this.crypt(this.salt);
    this.hash = this.crypt(password);
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
    await this.element.delete();
    await this.sessions.clear();
    await this.keys.clear();
    await this.deleteQuery();
  }

  crypt(string) {
    return new Crypto(string).salt(this.salt).hash();
  }

  verify(password) {
    return this.hash === this.crypt(password);
  }

  async selectSessions() {}

  async insertKey(expire = 0) {
    const key = new MysqlAuthKey(new MysqlAuthElement());
    key.account = this;
    key.expire = 0;

    await key.insert();

    return key;
  }

  async selectKeys() {}

  static async of(string) {
    const res = await mysql.query({
      statement: 'SELECT',
      table: table.accounts,
      imports: {
        element: 'string',
      },
      filter: {
        element: string,
        eid: string,
        email: string,
      },
      join: 'OR',
      single: true,
    });

    const uid = res.element;

    if (!uid) {
      throw 'default404';
    }

    const account = new MySQLAuthAccount(new MysqlAuthElement(uid));

    await account.select();

    return account;
  }
}
