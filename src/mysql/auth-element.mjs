import Crypto from '@wnynya/crypto';
import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';
import MySQLAuthPermissions from './auth-permissions.mjs';

export default class MySQLAuthElement extends MySQLClass {
  constructor(uid = Crypto.uid()) {
    super(mysql);

    this.uid = uid;
    this.label = 'A New AuthElement';
    this.creation = new Date();
    this.lastused = this.creation;

    this.table = table.elements;
    this.schema = {
      uid: 'string',
      label: 'string',
      creation: 'date',
      lastused: 'date',
    };
    this.filter = { uid: this.uid };

    this.permissions = new MySQLAuthPermissions(this);
  }

  async insert() {
    await this.permissions.insert();
    await this.insertQuery();
  }

  async select(parts) {
    await this.selectQuery(parts);
    if (parts == '*') {
      await this.permissions.select(['array']);
    }
  }

  async update(parts) {
    await this.updateQuery(parts);
  }

  async delete() {
    await this.permissions.delete();
    await this.deleteQuery();
  }
}
