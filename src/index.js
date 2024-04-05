/* eslint-disable import/prefer-default-export */
import tools from './tools';

const Helper = {};  // Helper functions (defined later)

export const EmailProtector = {
  defaultConfig: {
    code: 13,
    cssReverse: true,
    hiddenSpan: true,
    htmlComments: true,
  },
  config: {},
  params: {},

  rot: (str, code = 13) => String(str).replace(/[a-z]/gi, (char) => {
    const upperLimit = char <= 'Z' ? 90 : 122;
    const rotedChar = char.charCodeAt(0) + (code % 26);
    return String.fromCharCode((rotedChar <= upperLimit) ? rotedChar : rotedChar - 26);
  }),
  append: (parentID, params = {}, config = {}) => {
    const paramsPrepared = Helper.prepareParams(params);
    const configPrepared = Helper.prepareConfig(config);
    window.addEventListener('load', () => {
      const parentNode = document.getElementById(parentID);
      if (!parentNode) {
        throw new TypeError(`EmailProtector: element with ${parentID} ID not found`);
      }
      const linkNode = document.createElement('A');
      linkNode.id = tools.getUniqID();
      parentNode.appendChild(linkNode);
      Helper.setupLink(linkNode.id, paramsPrepared, configPrepared);
    });
  },
  write: (params = {}, config = {}) => {
    const paramsPrepared = Helper.prepareParams(params);
    const configPrepared = Helper.prepareConfig(config);
    const uniqID = tools.getUniqID();
    document.write(`<a id="${uniqID}"></a>`);
    Helper.setupLink(uniqID, paramsPrepared, configPrepared);
  },
  setGlobalParams: (params) => {
    EmailProtector.params = {};  // _prepareParams() use this value, so we have to reset it first
    EmailProtector.params = Helper.prepareParams(params);
  },
  setGlobalConfig: (config) => {
    EmailProtector.config = {};  // _prepareConfig() use this value, so we have to reset it first
    EmailProtector.config = Helper.prepareConfig(config);
  },
  resetParams: () => { EmailProtector.params = {}; },
  resetConfig: () => Object.assign(EmailProtector.config, EmailProtector.defaultConfig),
  decode: (event, code) => {
    const properEvent = event || window.event;
    const target = properEvent.target || properEvent.srcElement;
    if (!target.dataset.emailDecoded) {
      target.href = target.href.replace(
        new RegExp(String.raw`\b([a-zA-Z]{6}:)?${tools.emailRegExp.source}\b`, 'gi'),
        (match) => EmailProtector.rot(match, code),
      );
      target.dataset.emailDecoded = true;
    }
    return true;
  },
};

Helper.prepareParams = (params) => {
  let preparedParams = params;
  if (tools.isString(preparedParams)) {  // allow to pass an email address as a string only
    preparedParams = { email: preparedParams };
  }
  if (!(preparedParams instanceof Object)) {
    throw new TypeError('EmailProtector: params should be a string or an object');
  }
  preparedParams = { ...EmailProtector.params, ...preparedParams };
  if (!tools.isValidEmail(preparedParams.email)) {
    throw new TypeError(`EmailProtector: ${preparedParams.email} is not a valid email address`);
  }
  return preparedParams;
};

Helper.prepareConfig = (config) => ({
  ...EmailProtector.defaultConfig,
  ...EmailProtector.config,
  ...(config instanceof Object ? config : {}),
});

Helper.setupLink = (uniqID, params, config) => {
  const code = config.code % 26;  // for code numbers greater than 26
  const linkContainer = document.createDocumentFragment();
  if (config.linkLabel) {
    linkContainer.appendChild(document.createTextNode(config.linkLabel));
  } else {
    let linkText = EmailProtector.rot(params.email, code);
    const randomEmail = tools.getRandomEmail();
    const styleNode = document.createElement('STYLE');
    if (config.cssReverse) {
      linkText = tools.reverseString(linkText);
      styleNode.appendChild(document.createTextNode(`
        #${uniqID} {
          unicode-bidi: bidi-override;
          direction: rtl;
        }
      `));
    }
    const linkTextNode = document.createTextNode(linkText);
    linkContainer.appendChild(linkTextNode);
    if (config.hiddenSpan) {
      const hiddenSpan = document.createElement('span');
      hiddenSpan.appendChild(document.createTextNode(randomEmail));
      linkContainer.insertBefore(hiddenSpan, linkTextNode.splitText(linkText.indexOf('@')));
      styleNode.appendChild(document.createTextNode(`
        #${uniqID} span {
          display: none;
        }
      `));
    }
    if (config.htmlComments) {
      // Array.from to get static list => childNodes would change due to splitText()
      Array.from(linkContainer.childNodes).forEach((node) => {
        Helper.extendTextNodeWithComments(node, ['@', '.']);
      });
      linkContainer.insertBefore(document.createComment(` mailto:${randomEmail} `), linkContainer.firstChild);
    }
    if (styleNode.firstChild) document.head.appendChild(styleNode);
  }

  const mailtoEncrypted = EmailProtector.rot('mailto:', 26 - code);
  const emailLinkParams = Helper.prepareEmailLinkParams(params);
  const linkNode = document.getElementById(uniqID);
  linkNode.href = `${mailtoEncrypted}${params.email}${emailLinkParams}`;
  linkNode.appendChild(linkContainer);
  linkNode.addEventListener('mousedown', (event) => EmailProtector.decode(event, code));
};

Helper.extendTextNodeWithComments = (node, searchStrings) => {
  if (node.nodeType !== Node.TEXT_NODE) return false;
  const searchStringsArray = [].concat(searchStrings);  // ensure it's an array
  const searchRegExp = new RegExp(searchStringsArray.map((str) => tools.regExpEscape(str)).join('|'), 'g');
  const matches = node.textContent.match(searchRegExp) || [];  // [] => in case no match is found
  let currentNode = node;
  matches.forEach((str) => {
    const preComment = document.createComment(` pre ${str} `);
    const postComment = document.createComment(` post ${str} `);
    const strPos = currentNode.textContent.indexOf(str);
    if (strPos >= 0) {
      const strSplit = currentNode.splitText(strPos);
      currentNode.parentNode.insertBefore(preComment, strSplit);
      const strSplitAfter = strSplit.splitText(str.length);
      currentNode.parentNode.insertBefore(postComment, strSplitAfter);
      currentNode = strSplitAfter;
    }
  });
  return true;
};

Helper.prepareEmailLinkParams = (params) => {
  const result = Object.entries(params).reduce((acc, [key, value]) => (key.match(/^cc|bcc|subject|body$/gi) ? `${acc}&${key}=${encodeURIComponent(value)}` : acc), '');
  return (result.length > 0) ? `?${result.substring(1)}` : '';
};
