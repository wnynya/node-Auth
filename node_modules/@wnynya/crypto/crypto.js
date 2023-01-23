"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Crypto = void 0;
exports.hash = hash;
exports.uid = uid;
var _crypto = _interopRequireDefault(require("crypto"));
var _datwo = _interopRequireDefault(require("datwo"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Crypto {
  constructor(d = _crypto.default.randomBytes(256).toString('hex')) {
    this.d = d;
    this.s = '';
    this.k = '';
    return this;
  }
  salt(s) {
    if (s) {
      this.s = s;
    }
    return this;
  }
  key(k) {
    if (k) {
      this.k = k;
    }
    return this;
  }
  hash(algorithm = 'sha512') {
    const source = _crypto.default.createHmac(algorithm, this.s.toString());
    source.update(this.d.toString());
    const hash = source.digest('hex');
    return hash;
  }
  cipher(iv = Buffer.alloc(16, 0), algorithm = 'aes-256-cbc') {
    this.k = new Crypto(this.k).hash().substr(0, 32);
    const source = _crypto.default.createCipheriv(algorithm, this.k, iv);
    let result = source.update(this.d.toString(), 'utf8', 'hex');
    result += source.final('hex');
    return result;
  }
  decipher(iv = Buffer.alloc(16, 0), algorithm = 'aes-256-cbc') {
    this.k = new Crypto(this.k).hash().substr(0, 32);
    const source = _crypto.default.createDecipheriv(algorithm, this.k, iv);
    let result = source.update(this.d.toString(), 'hex', 'utf8');
    result += source.final('utf8');
    return result;
  }
  static randomNumber(amp = 1.0) {
    return _crypto.default.randomInt(0, 281474976710655) / (281474976710655 / amp);
  }
  static randomString(length, pool = '0123456789abcdefghijklmnopqrstuvwxyz') {
    if (typeof pool == 'string') {
      if (pool == 'hex') {
        pool = '0123456789abcdef'.split('');
      } else if (pool == 'num' || pool == 'number') {
        pool = '0123456789'.split('');
      } else {
        pool = pool.split('');
      }
    } else if (!(pool instanceof Array)) {
      throw new Error('pool must instanceof Array or typeof string');
    }
    let string = '';
    for (let i = 0; i < length; i++) {
      string += pool[Math.floor(this.randomNumber(pool.length))];
    }
    return string;
  }
  static uid(time = new _datwo.default().getTime()) {
    let dt = (new _datwo.default(time).format('CCCYYYYDDDDDCCC') * 1).toString(16);
    while (dt.length < 13) {
      dt = '0' + dt;
    }
    let b = '';
    b += this.randomString(2, 'hex');
    b += dt[0] + this.randomString(1, 'hex');
    b += dt[1] + this.randomString(1, 'hex');
    b += dt[2] + this.randomString(1, 'hex');
    b += dt[3] + this.randomString(1, 'hex');
    b += dt[4] + this.randomString(1, 'hex');
    b += dt[5] + this.randomString(1, 'hex');
    b += dt[6] + this.randomString(1, 'hex');
    b += dt[7] + this.randomString(1, 'hex');
    b += dt[8] + this.randomString(1, 'hex');
    b += dt[9] + this.randomString(1, 'hex');
    b += dt[10] + this.randomString(1, 'hex');
    b += dt[11] + this.randomString(1, 'hex');
    b += dt[12] + this.randomString(1, 'hex');
    b += this.randomString(4, 'hex');
    return b;
  }
  static random(amp) {
    return this.randomNumber(amp);
  }
}
exports.Crypto = Crypto;
function hash(d, s) {
  return new Crypto(d).salt(s).hash();
}
function uid() {
  return Crypto.uid();
}
var _default = Crypto;
exports.default = _default;

