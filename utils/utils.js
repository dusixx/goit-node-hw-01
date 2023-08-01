import { nanoid } from 'nanoid';

export const getId = nanoid;
export const isFunc = v => typeof v === 'function';

export const ERROR = {
  invalidPhone:
    '[Phone] Must be 10 digits long and may contain spaces and hyphens',

  invalidName: [
    '[Name] First name and last name (optional)',
    'must contain only latin letters,',
    'start with a capital and',
    'be at least 2 characters long',
  ].join(' '),

  invalidEmail: '[Email] Invalid email',
  alreadyExists: 'A contact with the same email or phone already exists',
};

const isValidName = v => /^\s*[A-Z][a-z]+(\s*[A-Z][a-z]+)?\s*$/.test(v);
const isValidEmail = v => /^\S+@\S+\.\S+$/.test(v);
const isValidPhone = v => /^([\s-]*\d[\s-]*){10}$/.test(v);

const formatPhone = v =>
  String(v)
    .replace(/[\s-]/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

export const format = {
  name(v) {
    const str = String(v).replace(',', ' ').trim();
    if (!isValidName(str)) throw Error(ERROR.invalidName);
    return str;
  },

  email(v) {
    if (!isValidEmail(v)) throw Error(ERROR.invalidEmail);
    return v.trim();
  },

  phone(v) {
    if (!isValidPhone(v)) throw Error(ERROR.invalidPhone);
    return formatPhone(v);
  },
};

export const checkIfContactExists = (list, { email, phone } = {}) => {
  if (!Array.isArray(list)) return;
  list.find(itm => {
    if (itm.email === email || (itm.phone && itm.phone === phone))
      throw Error(ERROR.alreadyExists);
  });
};

export const parseArgv = () => {
  let opt;

  const parsed = process.argv.slice(2).reduce((res, arg) => {
    if (/^--/.test(arg)) {
      // если значение у опции всего одно - сохраняем как есть
      if (res[opt]?.length === 1) res[opt] = res[opt][0];
      opt = arg.slice(2);
      res[opt] = [];
    } else {
      res[opt].push(arg);
    }

    return res;
  }, {});

  if (parsed[opt]?.length === 1) parsed[opt] = parsed[opt][0];

  return parsed;
};
