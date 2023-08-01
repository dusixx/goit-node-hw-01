import Contacts from './db/contacts.js';
import { parseArgv, isFunc } from './utils/utils.js';

const ERR_INVALID_ACTION = 'Unknown action type or action type not specified';
const contacts = new Contacts();
const { action, ...data } = parseArgv();

(async () => {
  try {
    const invokeAction = contacts[action];
    if (!isFunc(invokeAction)) throw Error(ERR_INVALID_ACTION);

    console.log((await invokeAction(data)) ?? '');
  } catch ({ message }) {
    console.error(`\n\x1b[41mError:`, `${message}\x1b[0m`);
  }
})();
