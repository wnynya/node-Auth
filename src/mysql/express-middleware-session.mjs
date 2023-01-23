import MySQLAuthSession from './auth-session.mjs';

export default function (options = {}) {
  options.name = options.name ? options.name : 'session';
  options.cookie = options.cookie ? options.cookie : {};

  return async function (req, res, next) {
    let sid = req.cookies[options.name];
    let session = new MySQLAuthSession(sid);

    if (sid) {
      await session
        .select(['data', 'expire', 'ip', 'ips', 'account'])
        .catch((error) => {
          session = new MySQLAuthSession();
        });
    }

    if (req.client) {
      session.ip = req.client.ip;
      if (!session.ips.includes(session.ip)) {
        session.ips.push(session.ip);
      }
      session.agent = req.client.agent.string;
      session.browser = req.client.agent.browser;
      session.system = req.client.agent.system;
    }

    if (sid) {
      session.lastused = new Date();
      await session.update(['lastused', 'ip', 'ips']).catch((error) => {
        session = new MySQLAuthSession();
      });
    }

    req.session = session.data;

    req.session.id = session.sid;

    if (session.account != '') {
      req.session.account = session.account;
    }

    req.session.save = async (maxAge = 0, account) => {
      const data = JSON.parse(JSON.stringify(req.session));
      delete data.id;
      delete data.save;
      delete data.destroy;
      session.data = data;

      // set session id cookie
      const opt = JSON.parse(JSON.stringify(options.cookie));
      if (maxAge == 0) {
        session.expire = new Date(0);
      } else {
        opt.maxAge = maxAge;
        session.expire = new Date(session.creation.getTime() + opt.maxAge);
      }
      res.cookie(options.name, session.sid, opt);

      // save session data
      account ? await session.save(account) : await session.save();
    };

    req.session.destroy = async () => {
      // destroy session id cookie
      const opt = JSON.parse(JSON.stringify(options.cookie));
      opt.expires = new Date(0);
      opt.maxAge = 0;
      res.cookie(options.name, session.sid, opt);

      // destroy session data
      await session.destroy();
    };

    if (
      0 < session.expire.getTime() &&
      session.expire.getTime() < new Date().getTime()
    ) {
      await req.session.destroy();
    }

    next();
  };
}
