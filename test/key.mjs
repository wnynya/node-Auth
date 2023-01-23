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

import { MySQLAuthAccount } from '../src/index.mjs';

async function test() {
  const account = await MySQLAuthAccount.of('tester');

  const key = await account.insertKey();

  await key.select();

  key.element.permissions.add(['test1']);
  await key.element.permissions.update(['array']);
}

test();
