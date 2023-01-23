export default class Permissions {
  schema = {
    array: 'array',
  };

  constructor(element) {
    this.element = element;
    this.array = [];
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

  delete(perms) {
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
  perm = perm.replace.replace(/[^a-z0-9.*-]/g, '');
  return perm;
}
