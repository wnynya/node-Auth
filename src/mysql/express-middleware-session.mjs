import MySQLAuthSession from './auth-session.mjs';

export default function (options = {}) {
  options.name = options.name ? options.name : 'session';
  options.cookie = options.cookie ? options.cookie : {};

  return async function (req, res, next) {
    !req.p ? (req.p = {}) : null;

    // 쿠키에서 세션 ID 가져오기
    let sid = req.cookies[options.name];
    let session = new MySQLAuthSession(sid);

    // 세션 ID 가 있는 경우
    if (sid) {
      // 저장된 세션 ID 인지 확인
      await session
        .select(['data', 'expire', 'ip', 'ips', 'account'])
        .catch((error) => {
          // 저장된 값이 없는 경우, 새로운 세션 대입
          session = new MySQLAuthSession();
          session.new = true;
        });
    }

    // @wnynya/express-middlewares { client } 미들웨어를 사용 중일 때
    if (req.client) {
      session.ip = req.client.ip;
      if (!session.ips.includes(session.ip)) {
        session.ips.push(session.ip);
      }
      session.agent = req.client.agent.string;
      session.browser = req.client.agent.browser;
      session.system = req.client.agent.system;
    }

    // 요청 오브젝트에 세션 data, id 대입
    req.session = session.data;
    req.session.id = session.sid;

    // 저장된 세션이 확인 된 경우
    if (!session.new) {
      // 마지막 세션 활동 저장
      session.lastused = new Date();
      await session.update(['lastused', 'ip', 'ips']);
    }

    // 저장된 세션이 로그인 된 세션인 경우
    if (session.account) {
      // 요청 오브젝트에 로그인 정보 대입
      req.session.account = session.account;
    }

    // 세션 저장 함수
    req.session.save = async (maxAge = 0, account) => {
      const sac = req.session.account;
      delete req.session.account;
      const data = JSON.parse(JSON.stringify(req.session));
      delete data.id;
      delete data.save;
      delete data.destroy;
      session.data = data;
      req.session.account = sac;

      // 세션 ID 쿠키 설정
      const opt = JSON.parse(JSON.stringify(options.cookie));
      if (maxAge == 0) {
        session.expire = new Date(0);
      } else {
        opt.maxAge = maxAge;
        session.expire = new Date(session.creation.getTime() + opt.maxAge);
      }
      res.cookie(options.name, session.sid, opt);

      // 세션 정보 저장
      account ? await session.save(account) : await session.save();
    };

    // 세션 제거 함수
    req.session.destroy = async () => {
      // 세션 ID 쿠키 제거
      const opt = JSON.parse(JSON.stringify(options.cookie));
      opt.expires = new Date(0);
      opt.maxAge = 0;
      res.cookie(options.name, session.sid, opt);

      // 세션 정보 제거
      await session.destroy();
    };

    // 만료된 세션인 경우 세션 제거
    if (
      0 < session.expire.getTime() &&
      session.expire.getTime() < new Date().getTime()
    ) {
      await req.session.destroy();
    }

    next();
  };
}
