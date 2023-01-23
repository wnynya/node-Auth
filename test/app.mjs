import MySQLClient from '@wnynya/mysql-client';

MySQLClient.setDefaultClient(
  new MySQLClient({
    host: '10.0.0.105',
    user: 'tester',
    password: '123456',
    database: 'test',
  })
);

import express from 'express';

import middlewares from '@wnynya/express-middlewares';
import auth, { MySQLAuthAccount } from '../src/index.mjs';

auth.setMySQLClient(MySQLClient.getDefaultClient());

const app = express();

app.use(middlewares.headers());
app.use(middlewares.cookies());
app.use(middlewares.client());
app.use(middlewares.JSONResponses());
app.use(auth.session());
app.use(auth.accounts());

app.get('/', (req, res) => {
  let data = req.session.id;
  if (req.login) {
    data += ' login with ' + req.account.eid + ' (' + req.account.label + ')';
  }
  if (req.hasPermission('test.a.b')) {
    data += ' hasperm';
  }
  data += ' ' + req.permissions;
  res.ok(data);
});

app.get('/save', (req, res) => {
  console.log('save');
  req.session.test = 'aaa';
  req.session.save();
  res.ok('save');
});

app.get('/destroy', (req, res) => {
  console.log('dest');
  req.session.destroy();
  res.ok('destroy');
});

app.get('/login', (req, res) => {
  MySQLAuthAccount.of('tester')
    .then((account) => {
      if (account.verify('123456')) {
        console.log(account.element.permissions);
        req.session.save(0, account);
        res.ok('login');
      } else {
        res.error('auth401');
      }
    })
    .catch(res.error);
});

app.listen(3000, () => {
  console.log('server on');
});
