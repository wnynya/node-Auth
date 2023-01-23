import Crypto from '@wnynya/crypto';

export default class AuthAccount {
  schema = {
    eid: 'string',
    email: 'string',
    salt: 'string',
    hash: 'string',
    phone: 'string',
    meta: 'object',
  };

  constructor(element) {
    this.element = element;
    this.eid = this.element.uid;
    this.email = '';
    this.hash = new Crypto().hash();
    this.salt = new Crypto().hash();
    this.phone = '';
    this.meta = {};
  }

  crypt(password) {
    return new Crypto(password).salt(this.salt).hash('sha512');
  }

  verify(password) {
    return this.crypt(password) === this.hash;
  }
}
