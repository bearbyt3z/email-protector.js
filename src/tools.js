const Tools = {
  isString: (value) => typeof value === 'string' || value instanceof String,
  isValidEmail: (str) => /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(String(str)),
  regExpEscape: (str) => String(str).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
  reverseString: (str) => String(str).split('').reverse().join(''),
  getRandomString: (length = 8, charset = 'abcdefghijklmnopqrstuvwxyz') => {
    let result = '';
    while (length--) result += charset[Math.floor(Math.random() * charset.length)];
    return result;
  },
  getRandomEmail: () => `${Tools.getRandomString(6)}@${Tools.getRandomString(10)}.${Tools.getRandomString(3)}`,
  getUniqID: () => `_${Date.now().toString(36) + Math.random().toString(36).substr(2)}`,
};

export default Tools;
