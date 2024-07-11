import tools from './tools';

describe('tools module', () => {
  describe('isString()', () => {
    test('string variables (like \'text\') are recognized as strings', () => {
      expect(tools.isString('text')).toBe(true);
    });

    test('empty string \'\' is recognized as a string', () => {
      expect(tools.isString('')).toBe(true);
    });

    test('numbers are NOT strings', () => {
      expect(tools.isString(-123)).toBe(false);
      expect(tools.isString(0)).toBe(false);
      expect(tools.isString(123)).toBe(false);
    });

    test('boolean values are NOT strings', () => {
      expect(tools.isString(true)).toBe(false);
      expect(tools.isString(false)).toBe(false);
    });

    test('null is NOT a string', () => {
      expect(tools.isString(null)).toBe(false);
    });

    test('undefined is NOT a string', () => {
      expect(tools.isString(undefined)).toBe(false);
    });
  });

  describe('isValidEmail()', () => {
    test('user@domain.net is a valid email address', () => {
      expect(tools.isValidEmail('user@domain.net')).toBe(true);
    });

    test('user.name@subdomain.domain.net is a valid email address', () => {
      expect(tools.isValidEmail('user.name@subdomain.domain.net')).toBe(true);
    });

    test('@domain.net is NOT a valid email address', () => {
      expect(tools.isValidEmail('@domain.net')).toBe(false);
    });

    test('user@.net is NOT a valid email address', () => {
      expect(tools.isValidEmail('user@.net')).toBe(false);
    });

    test('numbers are NOT valid email addresses', () => {
      expect(tools.isValidEmail(-123)).toBe(false);
      expect(tools.isValidEmail(0)).toBe(false);
      expect(tools.isValidEmail(123)).toBe(false);
    });

    test('boolean values are NOT valid email addresses', () => {
      expect(tools.isValidEmail(true)).toBe(false);
      expect(tools.isValidEmail(false)).toBe(false);
    });

    test('empty values (null, undefined, \'\') are NOT valid email addresses', () => {
      expect(tools.isValidEmail(null)).toBe(false);
      expect(tools.isValidEmail(undefined)).toBe(false);
      expect(tools.isValidEmail('')).toBe(false);
    });
  });

  describe('regExpEscape()', () => {
    test('All required characters are escaped correctly', () => {
      const escaped = '\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\';
      const unescaped = '^$.*+?()[]{}|\\';

      expect(tools.regExpEscape(unescaped + unescaped)).toBe(escaped + escaped);
    });

    test('Does NOT change a string with nothing to escape', () => {
      expect(tools.regExpEscape('abc def ghi')).toBe('abc def ghi');
    });

    test('Returns an empty string for empty values', () => {
      expect(tools.regExpEscape(null)).toBe('');
      expect(tools.regExpEscape(undefined)).toBe('');
      expect(tools.regExpEscape('')).toBe('');
    });
  });

  describe('reverseString()', () => {
    test('\'abcdefgh\' reversed is \'hgfedcba\'', () => {
      expect(tools.reverseString('abcdefgh')).toBe('hgfedcba');
    });

    test('\'abc def ghi\' reversed is \'ihg fed cba\'', () => {
      expect(tools.reverseString('abc def ghi')).toBe('ihg fed cba');
    });

    test('\'user@domain.net\' reversed is \'ten.niamod@resu\'', () => {
      expect(tools.reverseString('user@domain.net')).toBe('ten.niamod@resu');
    });

    test('\'user.name@subdomain.domain.net\' reversed is \'ten.niamod.niamodbus@eman.resu\'', () => {
      expect(tools.reverseString('user.name@subdomain.domain.net')).toBe('ten.niamod.niamodbus@eman.resu');
    });
  });

  describe('getRandomString()', () => {
    const numberOfStringsToTest = 1000;
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyz';
    const stringArray = Array(numberOfStringsToTest).fill(null).map(v => tools.getRandomString(length, charset));

    test(`among ${numberOfStringsToTest} generated strings, all of them are unique`, () => {
      const hasDuplicates = stringArray.length !== new Set(stringArray).size;
      expect(hasDuplicates).toBe(false);
    });

    test(`among ${numberOfStringsToTest} generated strings, all of them are NOT empty`, () => {
      const hasEmptyValues = stringArray.some(str => !str);
      expect(hasEmptyValues).toBe(false);
    });

    test(`among ${numberOfStringsToTest} generated strings, all of them are recognized as strings by isString()`, () => {
      const hasOnlyStrings = stringArray.every(str => tools.isString(str));
      expect(hasOnlyStrings).toBe(true);
    });

    test(`among ${numberOfStringsToTest} generated strings, all of them are of the right length`, () => {
      const haveRightLength = stringArray.every(str => str.length === length);
      expect(haveRightLength).toBe(true);
    });

    test(`among ${numberOfStringsToTest} generated strings, all of them have only chars from the charset`, () => {
      const haveRightCharset = stringArray.every(str => str.split('').every(letter => charset.includes(letter)));
      expect(haveRightCharset).toBe(true);
    });
  });

  describe('getRandomEmail()', () => {
    const numberOfEmailsToTest = 1000;

    const emailArray = Array(numberOfEmailsToTest).fill(null).map(v => tools.getRandomEmail());

    test(`among ${numberOfEmailsToTest} generated emails, all of them pass the isValidEmail() test`, () => {
      const allValidEmails = emailArray.every(email => tools.isValidEmail(email));
      expect(allValidEmails).toBe(true);
    });
  });

  describe('getUniqID()', () => {
    const numberOfIDsToTest = 1000;

    const stringArray = [];
    for (let i = 0; i < numberOfIDsToTest; i++)
      stringArray.push(tools.getUniqID());

    test(`among ${numberOfIDsToTest} generated IDs, all of them are NOT empty`, () => {
      const hasEmptyValues = stringArray.some(v => !v);
      expect(hasEmptyValues).toBe(false);
    });

    test(`among ${numberOfIDsToTest} generated IDs, all of them are unique`, () => {
      const hasDuplicates = stringArray.length !== new Set(stringArray).size;
      expect(hasDuplicates).toBe(false);
    });
  });
});
