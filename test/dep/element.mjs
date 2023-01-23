import AuthPermissions from './permissions.mjs';

export default class AuthElement {
  schema = {
    label: 'string',
    creation: 'date',
  };

  constructor(uid) {
    this.uid = uid;
    this.label = 'A New AuthElement';
    this.creation = new Date();
    this.permissions = new AuthPermissions(this);
  }
}
