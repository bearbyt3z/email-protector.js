const EmailProtector = {
	defaultConfig: {
		code: 13,
		cssReverse: true,
		hiddenSpan: true,
		htmlComments: true,
	},
	config: {},
	params: {},

	rot: (str, code = 13) => String(str).replace(
		/[a-z]/gi,
		(c) => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + code % 26) ? c : c - 26)
	),
	append: (parentID, params = {}, config = {}) => {
		params = EmailProtector._prepareParams(params);
		config = EmailProtector._prepareConfig(config);
		window.addEventListener('load', () => {
			const parentNode = document.getElementById(parentID);
			if (!parentNode) {
				throw new TypeError(`EmailProtector: element with ${parentID} ID not found`);
			}
			const linkNode = document.createElement('A');
			linkNode.id = Tools.getUniqID();
			parentNode.appendChild(linkNode);
			EmailProtector._setupLink(linkNode.id, params, config);
		});
	},
	write: (params = {}, config = {}) => {
		params = EmailProtector._prepareParams(params);
		config = EmailProtector._prepareConfig(config);
		const uniqID = Tools.getUniqID();
		document.write(`<a id="${uniqID}"></a>`);
		EmailProtector._setupLink(uniqID, params, config);
	},
	_prepareParams: (params) => {
		if (Tools.isString(params)) {  // allow to pass an email address as a string only
			params = { email: params };
		}
		if (!(params instanceof Object)) {
			throw new TypeError('EmailProtector: params should be a string or an object');
		}
		params = Object.assign({}, EmailProtector.params, params);
		if (!Tools.isValidEmail(params.email)) {
			throw new TypeError(`EmailProtector: ${params.email} is not a valid email address`);
		}
		return params;
	},
	_prepareConfig: (config) => {
		if (!(config instanceof Object)) {
			console.warn('EmailProtector: config should be an object');
			config = {};
		}
		return Object.assign({}, EmailProtector.defaultConfig, EmailProtector.config, config);
	},
	setGlobalParams: (params) => {
		EmailProtector.params = {};  // _prepareParams() use this value, so we have to reset it first
		EmailProtector.params = EmailProtector._prepareParams(params);
	},
	setGlobalConfig: (config) => {
		EmailProtector.config = {};  // _prepareConfig() use this value, so we have to reset it first
		EmailProtector.config = EmailProtector._prepareConfig(config);
	},
	resetParams: () => EmailProtector.params = {},
	resetConfig: () => Object.assign(EmailProtector.config, EmailProtector.defaultConfig),
	_setupLink: (uniqID, params, config) => {
		const code = config.code % 26;  // for code numbers greater than 26
		const linkContainer = document.createDocumentFragment();
		if (config.linkLabel) {
			linkContainer.appendChild(document.createTextNode(config.linkLabel));
		} else {
			let linkText = EmailProtector.rot(params.email, code);
			const randomEmail = Tools.getRandomEmail();
			const styleNode = document.createElement('STYLE');
			if (config.cssReverse) {
				linkText = Tools.reverseString(linkText);
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
				Array.from(linkContainer.childNodes).forEach((node) => {  // Array.from => to get static list => childNodes would change due to splitText()
					EmailProtector._extendTextNodeWithComments(node, ['@', '.']);
				});
				linkContainer.insertBefore(document.createComment(` mailto:${randomEmail} `), linkContainer.firstChild);
			}
			if (styleNode.firstChild) document.head.appendChild(styleNode);
		}

		const mailtoEncrypted = EmailProtector.rot('mailto:', 26 - code);
		const emailLinkParams = EmailProtector._prepareEmailLinkParams(params);
		const linkNode = document.getElementById(uniqID);
		linkNode.href = `${mailtoEncrypted}${params.email}${emailLinkParams}`;
		linkNode.appendChild(linkContainer);
		linkNode.addEventListener('mousedown', (event) => EmailProtector.decode(event, code));
	},
	_extendTextNodeWithComments: (node, searchStrings) => {
		if (node.nodeType !== Node.TEXT_NODE) return false;
		searchStrings = [].concat(searchStrings);  // ensure it's an array
		const searchRegExp = new RegExp(searchStrings.map((str) => Tools.regExpEscape(str)).join('|'), 'g');
		const matches = node.textContent.match(searchRegExp) || [];  // [] => in case no match is found
		for (const str of matches) {
			const preComment = document.createComment(` pre ${str} `);
			const postComment = document.createComment(` post ${str} `);
			const strPos = node.textContent.indexOf(str);
			if (strPos >= 0) {
				const strSplit = node.splitText(strPos);
				node.parentNode.insertBefore(preComment, strSplit);
				const strSplitAfter = strSplit.splitText(str.length);
				node.parentNode.insertBefore(postComment, strSplitAfter);
				node = strSplitAfter;
			}
		}
		return true;
	},
	decode: (event, code) => {
		event = event || window.event;
		const target = event.target || event.srcElement;
		if (!target.dataset.emailDecoded) {
			target.href = target.href.replace(
				/\b(\w{6}:)?\w+(@|%40)\w+\.\w+\b/gi,
				(match) => EmailProtector.rot(match, code)
			);
			target.dataset.emailDecoded = true;
		}
		return true;
	},
	_prepareEmailLinkParams: (params) => {
		let result = '';
		for (const [key, value] of Object.entries(params)) {
			if (key.match(/^cc|bcc|subject|body$/gi))
				result += `&${key}=${encodeURIComponent(value)}`;
		}
		return (result.length > 0) ? `?${result.substr(1)}` : '';
	},
};

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
