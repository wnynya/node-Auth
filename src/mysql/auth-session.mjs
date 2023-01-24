import Crypto from '@wnynya/crypto';
import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';
import MySQLAuthAccount from './auth-account.mjs';
import MySQLAuthElement from './auth-element.mjs';

export default class MySQLAuthSession extends MySQLClass {
  constructor(sid = Crypto.uid()) {
    super(mysql);

    this.sid = sid;
    this.data = {};
    this.creation = new Date();
    this.lastused = this.creation;
    this.expire = new Date(this.creation.getTime() + 86400000);
    this.account = '';
    this.agent = '';
    this.system = '';
    this.browser = '';
    this.ip = '';
    this.ips = [];

    this.table = table.sessions;
    this.schema = {
      sid: 'string',
      data: 'object',
      creation: 'date',
      lastused: 'date',
      expire: 'date',
      account: [
        (uid) => {
          return uid == ''
            ? uid
            : new MySQLAuthAccount(new MySQLAuthElement(uid));
        },
        (acn) => {
          return acn == '' ? acn : acn.element.uid;
        },
      ],
      agent: 'string',
      system: 'string',
      browser: 'string',
      ip: 'string',
      ips: 'array',
    };
    this.filter = { sid: this.sid };

    this.new = true;
  }

  async insert() {
    await this.insertQuery();
  }

  async select(parts = '*') {
    await this.selectQuery(parts);
    this.new = false;
  }

  async update(parts) {
    await this.updateQuery(parts);
  }

  async delete() {
    await this.deleteQuery();
  }

  async save(account) {
    if (account) {
      this.account = account;
      this.new
        ? await this.insert([
            'sid',
            'data',
            'creation',
            'lastused',
            'expire',
            'account',
            'agent',
            'browser',
            'system',
            'ip',
            'ips',
          ])
        : await this.update(['account', 'data']);
    } else {
      this.new
        ? await this.insert([
            'sid',
            'data',
            'creation',
            'lastused',
            'expire',
            'agent',
            'browser',
            'system',
            'ip',
            'ips',
          ])
        : await this.update(['data']);
    }
  }

  async destroy() {
    await this.delete();
  }
}
