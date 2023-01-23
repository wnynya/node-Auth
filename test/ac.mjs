import MySQLClient from '@wnynya/mysql-client';

MySQLClient.setDefaultClient(
  new MySQLClient({
    host: '10.0.0.105',
    user: 'tester',
    password: '123456',
    database: 'test',
  })
);

import auth from '../src/index.mjs';

auth.setMySQLClient(MySQLClient.getDefaultClient());

import { MysqlAuthElement } from '../src/index.mjs';
import { MySQLAuthAccount } from '../src/index.mjs';

async function test() {
  const account = new MySQLAuthAccount(new MysqlAuthElement());
  account.eid = 'tester';
  account.email = 'tester@example.com';
  await account.insert('123456');

  const permissions = account.element.permissions;
  permissions.add(['test.*', 'test2', 'test3.aaa']);

  await permissions.update(['array']);
}

test();
