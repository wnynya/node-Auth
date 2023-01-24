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

app.get('/destroy', (req, res) => {
  req.session.destroy();
  res.ok('destroy');
});

app.get('/login', (req, res) => {
  MySQLAuthAccount.of('tester')
    .then((account) => {
      if (account.verify('123456')) {
        req.session.save(0, account);
        res.ok('login');
      } else {
        res.error('auth401');
      }
    })
    .catch(res.error);
});

app.get('/index', (req, res) => {
  MySQLAuthAccount.index(req.query.search, req.query.size, req.query.page, true)
    .then(res.data)
    .catch(res.error);
});

app.get('/keys', (req, res) => {
  req.session.account
    .selectKeys(req.query.size, req.query.page, true)
    .then(res.data)
    .catch(res.error);
});

app.get('/sessions', (req, res) => {
  req.session.account
    .selectSessions(req.query.size, req.query.page, true)
    .then(res.data)
    .catch(res.error);
});

app.listen(3000, () => {
  console.log('server on');
});
