import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';
import AuthElement from './auth-element.mjs';

export default class AuthPermissions extends MySQLClass {
  constructor(element) {
    super(mysql);

    this.element = element;
    this.array = [];

    this.table = table.permissions;
    this.schema = {
      element: [
        (uid) => {
          return new AuthElement(uid);
        },
        (elm) => {
          return elm.uid;
        },
      ],
      array: 'array',
    };
    this.filter = { element: this.element.uid };
  }

  async insert() {
    await this.insertQuery();
  }

  async select(parts) {
    await this.selectQuery(parts);
  }

  async update(parts = ['array']) {
    await this.updateQuery(parts);
  }

  async delete() {
    await this.deleteQuery();
  }

  add(perms) {
    if (perms instanceof String) {
      perms = [perms];
    }

    for (let perm of perms) {
      perm = escape(perm);
      if (!this.array.includes(perm)) {
        this.array.push(perm);
      }
    }

    this.array.sort();
  }

  del(perms) {
    if (perms instanceof String) {
      perms = [perms];
    }

    for (let perm of perms) {
      perm = escape(perm);
      if (this.array.includes(perm)) {
        const index = this.array.indexOf(perm);
        this.array.splice(index, 1);
      }
    }
  }

  has(perm) {
    return has(this.array, perm);
  }

  static hasPermission(perms, perm) {
    return has(perms, perm);
  }

  static mapArray = [];

  static setMap(map, prefix = '') {
    function pa(obj, prefix = '') {
      for (const key in obj) {
        AuthPermissions.mapArray.push(prefix + key);
        obj[key] != {} ? pa(obj[key], prefix + key + '.') : null;
      }
    }
    pa(map, prefix);
  }

  static getMap() {
    return AuthPermissions.mapArray;
  }
}

function has(perms, perm) {
  if (!Array.isArray(perms)) {
    return false;
  }
  let bool = false;
  for (const p of perms) {
    if (p.startsWith('-')) {
      if (check(p.substring(1), perm)) {
        return false;
      }
    } else if (bool) {
      continue;
    } else {
      bool = check(p, perm);
    }
  }
  return bool;
}

function check(source, target) {
  const sourceArray = source.split('.');
  const targetArray = target.split('.');
  const loop = Math.max(sourceArray.length, targetArray.length);
  let bool = false;
  let lastSource;
  for (let n = 0; n < loop; n++) {
    lastSource =
      sourceArray[n] === null || sourceArray[n] === undefined
        ? '*'
        : sourceArray[n];
    bool =
      lastSource === targetArray[n] ||
      (lastSource === '*' &&
        !(targetArray[n] === null || targetArray[n] === undefined));
    if (!bool) {
      break;
    }
  }
  return bool;
}

function escape(perm) {
  perm = perm + '';
  perm = perm.toLowerCase();
  perm = perm.replace(/[^a-z0-9.*-]/g, '');
  return perm;
}
