import MySQLAuthKey from './auth-key.mjs';
import { MySQLAuthElement, MySQLAuthPermissions } from './index.mjs';

export default function (options = {}) {
  return async function (req, res, next) {
    !req.p ? (req.p = {}) : null;

    // 요청에 키 값이 있는지 확인 (헤더, 쿼리)
    const kid =
      req.headers['Authorization'] ||
      req.headers['O'] ||
      req.query.authorization ||
      req.query.o;

    let account;
    let key;
    let permissions;

    // 기본 값 설정
    req.login = false; // 계정 혹은 키로 요청이 인증되지 않음
    req.permissions = []; // 요청에 권한 노드가 존재하지 않음
    // 요청 권한 확인 함수
    req.hasPermission = (perm) => {
      return MySQLAuthPermissions.hasPermission(req.permissions, perm);
    };

    // 키 값이 있는 경우
    let kiv = false;
    if (kid) {
      // 키 값이 존재하는지 확인 / 정보 불러오기
      key = new MySQLAuthKey(new MySQLAuthElement(kid));
      await key.select().catch(() => {
        kiv = true;
      });
      // 키가 만료되었는지 확인
      if (0 < key.expire && key.expire.getTime() < new Date().getTime()) {
        kiv = true;
      }
      // 마지막 키 사용 시간 업데이트
      key.element.lastused = new Date();
      await key.element.update(['lastused']);
      // 키의 계정 정보 대입 (세션의 로그인된 계정 정보를 사용하지 않음)
      account = key.account;
    }

    // 키 값이 없거나 invalid 한 키 값인 경우
    if (!kid || kiv) {
      // 세션이 없거나, 세션에 로그인 정보가 없는 경우
      if (!req.session || !req.session.account) {
        next();
        return;
      }
      // 세션에 로그인된 계정 정보 대입
      account = req.session.account;
    }

    // 계정 정보 불러오기
    await account.select().catch(() => {
      next();
      return;
    });

    // 현재 요청의 권한 목록 담아두기
    // 인증된 키가 있을 경우 ? 키 권한 : 키가 없을 경우 = 계정 권한
    permissions =
      kid && kiv ? key.element.permissions : account.element.permissions;

    // 요청 오브젝트에 담아서 넘기기
    req.login = true;
    req.permissions = permissions.array;

    req.account = {};
    req.account.uid = account.element.uid;
    req.account.label = account.element.label;
    req.account.eid = account.eid;
    req.account.email = account.email;

    if (key) {
      req.key = {};
      req.key.uid = key.element.uid;
      req.key.label = key.element.label;
    }

    next();
  };
}
