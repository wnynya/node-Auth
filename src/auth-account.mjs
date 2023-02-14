import Crypto from '@wnynya/crypto';
import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';
import AuthElement from './auth-element.mjs';
import AuthKey from './auth-key.mjs';
import AuthSession from './auth-session.mjs';

export default class AuthAccount extends MySQLClass {
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
          return new AuthElement(uid);
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
    if (this.email) {
      this.gravatar = `https://www.gravatar.com/avatar/${new Crypto(
        this.email
      ).hash('md5')}`;
    }
  }

  async update(parts) {
    await this.element.update(parts);
    await this.updateQuery(parts);
  }

  async updatePassword(password) {
    this.hash = this.crypt(password);
    await this.update(['hash']);
  }

  async delete() {
    await this.element.delete();
    await this.sessions.clear();
    await this.keys.clear();
    await this.deleteQuery();
  }

  toJSON() {
    return {
      uid: this.element.uid,
      label: this.element.label,
      creation: this.element.creation.getTime(),
      lastused: this.element.lastused.getTime(),
      eid: this.eid,
      email: this.email,
      phone: this.phone,
      gravatar: this.gravatar,
      permissions: this.element.permissions.array,
    };
  }

  crypt(string) {
    return new Crypto(string).salt(this.salt).hash();
  }

  verify(password) {
    return this.hash === this.crypt(password);
  }

  async selectSessions(size = 20, page = 1, toJSON = false) {
    const res = await mysql.query({
      statement: 'SELECT',
      table: table.sessions,
      imports: {
        sid: 'string',
      },
      filter: {
        account: this.element.uid,
      },
      size: size,
      page: page,
      sort: {
        creation: 'DESC',
      },
    });

    let sessions = [];
    const tasks = [];

    for (const data of res) {
      const session = new AuthSession(data.sid);
      sessions.push(session);
      tasks.push(session.select());
    }

    await Promise.all(tasks);

    if (toJSON) {
      const sessionsJSON = [];
      for (const session of sessions) {
        sessionsJSON.push(session.toJSON());
        /*sessionsJSON.push({
          sid: session.sid,
          creation: session.creation.getTime(),
          lastused: session.lastused.getTime(),
          expire: session.expire.getTime(),
          agent: session.agent,
          browser: session.browser,
          system: session.system,
          ip: session.ip,
        });*/
      }
      sessions = sessionsJSON;
    }

    return sessions;
  }

  async selectSession(sid) {
    const session = new AuthSession(sid);
    await session.select();

    if (session.account != this.element.uid) {
      throw 'session404';
    }

    return session;
  }

  async clearSessions() {
    await mysql.query({
      statement: 'DELETE',
      table: table.sessions,
      filter: {
        account: this.element.uid,
      },
    });
  }

  async insertKey(expire = 0) {
    const key = new AuthKey(new AuthElement());
    key.account = this;
    key.expire = 0;

    await key.insert();

    return key;
  }

  async selectKeys(size = 20, page = 1, toJSON = false) {
    const res = await mysql.query({
      statement: 'SELECT',
      table: table.keys,
      imports: {
        element: (uid) => {
          return new AuthElement(uid);
        },
      },
      filter: {
        account: this.element.uid,
      },
      size: size,
      page: page,
    });

    let keys = [];
    const tasks = [];

    for (const data of res) {
      const key = new AuthKey(data.element);
      keys.push(key);
      tasks.push(key.select());
    }

    await Promise.all(tasks);

    if (toJSON) {
      const keysJSON = [];
      for (const key of keys) {
        keysJSON.push(key.toJSON());
        /*keysJSON.push({
          uid: key.element.uid,
          label: key.element.label,
          creation: key.element.creation.getTime(),
          lastused: key.element.lastused.getTime(),
          expire: key.expire.getTime(),
          permissions: key.element.permissions.array,
        });*/
      }
      keys = keysJSON;
    }

    return keys;
  }

  async selectKey(kid) {
    const key = new AuthKey(new AuthElement(kid));
    await key.select();

    if (key.account != this.element.uid) {
      throw 'key404';
    }

    return key;
  }

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

    const account = new AuthAccount(new AuthElement(uid));

    await account.select();

    return account;
  }

  static async index(
    search,
    size = 20,
    page = 1,
    count = false,
    toJSON = false
  ) {
    const res = await mysql.query({
      statement: 'SELECT',
      table: table.accounts,
      imports: {
        element: (uid) => {
          return new AuthElement(uid);
        },
      },
      filter:
        !search || search == ''
          ? undefined
          : {
              element: search,
              eid: `%${search}%`,
              email: `%${search}%`,
            },
      join: 'OR',
      like: true,
      size: size,
      page: page,
      count: count,
    });

    let accounts = [];
    const tasks = [];

    for (const data of res) {
      const account = new AuthAccount(data.element);
      accounts.push(account);
      tasks.push(account.select());
    }

    await Promise.all(tasks);

    if (toJSON) {
      const accountsJSON = [];
      for (const account of accounts) {
        accountsJSON.push(account.toJSON());
        /*accountsJSON.push({
          uid: account.element.uid,
          label: account.element.label,
          creation: account.element.creation.getTime(),
          lastused: account.element.lastused.getTime(),
          eid: account.eid,
          email: account.email,
          phone: account.phone,
          permissions: account.element.permissions.array,
        });*/
      }
      accounts = accountsJSON;
    }

    return accounts;
  }
}
