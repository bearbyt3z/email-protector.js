const Tools = {
  // email regular expression via MDN Web Docs => https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
  emailRegExp: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  isString: (value) => typeof value === 'string' || value instanceof String,
  isValidEmail: (str) => (new RegExp(`^${Tools.emailRegExp.source}$`)).test(String(str)),
  regExpEscape: (str) => String(str).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
  reverseString: (str) => String(str).split('').reverse().join(''),
  getRandomString: (length = 8, charset = 'abcdefghijklmnopqrstuvwxyz') => Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join(),
  getRandomEmail: () => `${Tools.getRandomString(6)}@${Tools.getRandomString(10)}.${Tools.getRandomString(3)}`,
  getUniqID: () => `_${Date.now().toString(36) + Math.random().toString(36).substr(2)}`,
};

export default Tools;
