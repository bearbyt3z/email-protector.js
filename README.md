# email-protector.js

This is a JavaScript library for protecting email addresses included on webpages from spam bots.
It uses different obfuscation techniques to hide the real email address and `mailto` links, as well as methods for correct presentation of them to the user.
The trick is to use simple [ROT](https://en.wikipedia.org/wiki/ROT13) encoding function (i.e. [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher)),
to hide an email address and decode it whenever the user clicks on a link (any mouse button click is counted here, because of the usage of the `mousedown` event).

There are also some other obfuscation techniques used to protect email addresses as CSS reverse technique, hidden `<span>` addition, and HTML comments insertion.
Look at the [Resources](#resources) section for more details about the subject, especially the first two articles.


## Prerequisites

There are no any prerequisites for the library to use other than JavaScript enabled in a browser.
It should run without issues on any modern web browser.
The library was tested on:

* Mozilla Firefox v75
* Google Chrome v80
* Opera v67

But it should run smoothly also in:

* Mozilla Firefox &ge; v47
* Google Chrome &ge; v54
* Opera &ge; v41
* Safari &ge; v10.1
* Microsoft Edge &ge; v14
* (no Internet Explorer support)

These are the browser versions that are compatible with [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) method (ES8), which is used in the library.

Some older browsers can have problems with new [ECMAScript](https://www.ecma-international.org/publications/standards/Ecma-262.htm) syntax but hey, who uses them nowadays? :wink:

If you really need to run the library on some ancient browsers, please use [Babel transcompiler](https://babeljs.io) or pull the request, so I can make a polyfill for the library and attach the compiled version to the repository.


## Installation

To use the library with your HTML documents include the `email-protector.js` file using `<script>` tag.
You can download it and include as a local file (this way future changes to the project will not break your webpage):
```html
<script src="assets/js/email-protector.js"></script>
```
Or you can attach the library with the global link as well:
```html
<script src="https://raw.githubusercontent.com/bearbyt3z/email-protector.js/master/email-protector.js"></script>
```

## Preparing email address

It is important to stress that an email address provided as an argument to each output function (see [Inserting Email Address into HTML document](#inserting-email-address-into-html-document) section) must be already encoded - we don't want to share it with spam bots.
You can encode your email address using online tools like [rot13.com](https://rot13.org), or using function `rot()` build in the `EmailProtector` (calling it directly in a browser console or in a `<script>` tag).

Here is an example using default value of `code` parameter (which is `13`):
```javascript
console.log(EmailProtector.rot('user@domain.net'));
```
The expected output is:
```
hfre@qbznva.arg
```
Another example for ROT23 encoding (code `23`):
```javascript
console.log(EmailProtector.rot('user@domain.net', 23));
```
The output will be:
```
rpbo@aljxfk.kbq
```

See [Configuration Parameters](#configuration-parameters) section explaining the usage of `code` and rest of configuration parameters.


## Inserting Email Address into HTML document

There are two methods available to insert your email address link into HTML document.


### Using `append()` method

The first one assumes creating a HTML element with an arbitrary ID and calling `append()` function with the ID and encoded email address as parameters:
```html
<body>
	<!-- script with appedn() method can be placed anywhere in a HTML document -->
	<script>
		EmailProtector.append('email-protector', 'hfre@qbznva.arg');
	</script>
	...
	<p>
		Please contact me at <span id="email-protector"></span>
	</p>
</body>
```
Please keep in mind, that the email link will be added as the last child of the provided HTML element (the same behavior as in case of [`Node.appendChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) method).

The `append()` method uses [`window.onload`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload) event to add an email address link to the specified HTML element, so it can be executed anywhere in a HTML document.

The above code will generate the following result:
```html
<p>
	Please contact me at
	<span id="email-protector">
		<a id="_k905fu05ixbj1tazna" href="znvygb:hfre@qbznva.arg">
			<!-- mailto:spdgsl@mkuhrekslo.euh -->
			ten
			<!-- pre . -->
			.
			<!-- post . -->
			niamod
			<span>spdgsl@mkuhrekslo.euh</span>
			<!-- pre @ -->
			@
			<!-- post @ -->
			resu
		</a>
	</span>
</p>
```

**Notice: Please keep in mind that `id` attribute of every link tag is randomly generated, and should be unique across the entire webpage.**


### Using `write()` method

Second technique uses [`document.write()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write) method to print an email link exactly after the `<script>` tag, where the `EmailProtector.write()` method is called:

```html
<body>
	<p>
		Please contact me at
		<script>
			EmailProtector.write('hfre@qbznva.arg');
		</script>
	</p>
</body>
```
Notice that there is no parameter corresponding to the ID of a DOM element, because the email link is placed where the `<script>` tag occurs.

The above code will generate a very similar result to the `append()` method:

```html
<p>
  Please contact me at
  <script>
    EmailProtector.write('hfre@qbznva.arg');
  </script>
  <a id="_k905fu05ixbj1tazna" href="znvygb:hfre@qbznva.arg">
    <!-- mailto:spdgsl@mkuhrekslo.euh -->
    ten
    <!-- pre . -->
    .
    <!-- post . -->
    niamod
    <span>spdgsl@mkuhrekslo.euh</span>
    <!-- pre @ -->
    @
    <!-- post @ -->
    resu
  </a>
</p>
```

## Email parameters

You can specify email link parameters using first (in case of `write()`) or second (in case of `aplly()`) argument when calling both methods.
The argument must be a string representing encoded email address or an object with any supported link parameters:
* `email` - an ROT encoded email address;
* `subject` - the subject of an email message (should not be encoded);
* `body` - the body of an email (not encoded);
* `cc` - carbon copy of an email (also ROT encoded);
* `bcc` - blind carbon copy (also ROT encoded).

Here is an example of all email link parameters passed to the write function:
```javascript
EmailProtector.write({
	email:   'hfre@qbznva.arg',
	subject: 'Message from www',
	body:    'Hi, I\'m contacting you',
	cc:      'hfre2@qbznva.arg',
	bcc:     'hfre3@qbznva.arg'
});
```
The `cc` and `bcc` parameters correspond to `user2@domain.net` and `user3@domain.net` respectively.
As stated above they also have to be ROT encoded, because they will be subjected to the decoding process as well (we don't want to expose them to spam bots either).


## Configuration parameters

The last parameter of the `append()` and `write()` functions specifies the `EmailProtector` configuration object.
There are several config options you can choose from to adjust encoding and the display value of an email link.


### `code`

Specifies the code value for email decoding i.e. [Caesar cipher code](https://en.wikipedia.org/wiki/ROT13).
You have to pass the code value that will revert back the encoding, so this parameter is crucial for proper work of the `EmailProtector`.

The code can be computed as the difference between `26` and the code value (modulo 26) used in encoding.
For example if the code `11` was used to encode an email address, then the code `15` should be used for decoding.
You can also use numbers greater than 26, but the `rot()` and decoding functions will do modulo operation anyway.

The default value is `13` i.e. ROT13 encoding is assumed.
Notice that for this value both encoder and decoder code are the same.


### `linkLabel`

Specifies the display value used as an email link label. If set the provided email address will not be printed inside the email link. Instead the value of this parameter will be used.

The default value is `undefined` i.e. the email address is used as the link label.


### `cssReverse`

Use the CSS reverse obfuscation technique to hide the real email address displayed in the link label.
The email address is written in reverse order and the following CSS code is used to display it in the correct way:
```css
unicode-bidi: bidi-override;
direction: rtl;
```
The default value is `true`.

This option is taken into account only when `linkLabel` is unset (undefined).


### `hiddenSpan`

Inserts a `<span>` element in the middle of the email link label (before `@` char).
The `span` is hidden using CSS `display: none` property, so it is invisible for a user.

The default value is `true`.

This option is taken into account only when `linkLabel` is unset (undefined).


### `htmlComments`

Adds another obfuscation technique using HTML comments. Dot (`.`) and at (`@`) signs are extended with comments in the following way:
```html
<!-- pre @ -->@<!-- post @ -->
```
Furthermore there is another comment inserted at the beginning of the email link label with some fake (generated) email address, e.g.:
```html
<!-- mailto:spdgsl@mkuhrekslo.euh -->
```

The default value of this parameter is `true`.

This option is taken into account only when `linkLabel` is unset (undefined).


## Code Examples

Here are some examples of tuning the output result from the library.
To keep it simple only an email address is passed as the email link parameter.
Please look also at the `examples.html` file where you can find more examples of the library usage.

---

JavaScript input:
```javascript
EmailProtector.write('hfre@qbznva.arg', { linkLabel: 'Click here to contact me' });
```
HTML result:
```html
<a id="_k905fu05ixbj1tazna" href="znvygb:hfre@qbznva.arg">
	Click here to contact me
</a>
```

---

JavaScript input:
```javascript
EmailProtector.write('hfre@qbznva.arg', {
	cssReverse: false,
	hiddenSpan: false,
	htmlComments: false
});
```
HTML result:
```html
<a id="_k905fu05ixbj1tazna" href="znvygb:hfre@qbznva.arg">
	user@domain.net
</a>
```

---

JavaScript input:
```javascript
EmailProtector.write('hfre@qbznva.arg', {
	cssReverse: true,
	hiddenSpan: false,
	htmlComments: false
});
```
HTML Result (+ CSS text reversing style):
```html
<a id="_k905fu05ixbj1tazna" href="znvygb:hfre@qbznva.arg">
	ten.niamod@resu
</a>
```

---

JavaScript input:
```javascript
EmailProtector.write('hfre@qbznva.arg', {
	cssReverse: false,
	hiddenSpan: true,
	htmlComments: false
});
```
HTML result (+ CSS hiding `<span>` style):
```html
<a id="_k905fu05ixbj1tazna" href="znvygb:hfre@qbznva.arg">
	user
	<span>spdgsl@mkuhrekslo.euh</span>
	@domain.net
</a>
```

---

JavaScript input:
```javascript
EmailProtector.write('hfre@qbznva.arg', {
	cssReverse: false,
	hiddenSpan: false,
	htmlComments: true
});
```
HTML result:
```html
<a id="_k905fu05ixbj1tazna" href="znvygb:hfre@qbznva.arg">
	<!-- mailto:spdgsl@mkuhrekslo.euh -->
	user
	<!-- pre @ -->
	@
	<!-- post @ -->
	domain
	<!-- pre . -->
	.
	<!-- post . -->
	net
</a>
```

---

JavaScript input:
```javascript
EmailProtector.write('hfre@qbznva.arg', {
	cssReverse: false,
	hiddenSpan: false,
	htmlComments: true
});
```
or simply:
```javascript
EmailProtector.write('hfre@qbznva.arg');
```
HTML result:
```html
<a id="_k905fu05ixbj1tazna" href="znvygb:hfre@qbznva.arg">
	<!-- mailto:spdgsl@mkuhrekslo.euh -->
	ten
	<!-- pre . -->
	.
	<!-- post . -->
	niamod
	<span>spdgsl@mkuhrekslo.euh</span>
	<!-- pre @ -->
	@
	<!-- post @ -->
	resu
</a>
```

## Resources

1. Silvan Mühlemann's Blog post: [Nine ways to obfuscate e-mail addresses compared](https://blog.mühlemann.ch/2008/07/20/ten-methods-to-obfuscate-e-mail-addresses-compared/).
1. Hervé Grall's article: [Anti-spam measure: Against bots harvesting email addresses](http://www.grall.name/posts/1/antiSpam-emailAddressObfuscation.html).
1. Stack Overflow discutions:
	* [Effective method to hide email from spam bots](https://stackoverflow.com/questions/483212/effective-method-to-hide-email-from-spam-bots);
	* [Hide Email Address from Bots - Keep mailto](https://stackoverflow.com/questions/41318987/hide-email-address-from-bots-keep-mailto);
	* [How to spamproof a mailto link?](https://stackoverflow.com/questions/3624667/how-to-spamproof-a-mailto-link);
	* [What are some ways to protect emails on websites from spambots?](https://stackoverflow.com/questions/308772/what-are-some-ways-to-protect-emails-on-websites-from-spambots);
	* [How to show email addresses on the website to avoid spams?](https://stackoverflow.com/questions/23002711/how-to-show-email-addresses-on-the-website-to-avoid-spams).


## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details.

I really like the open-source software paradigm, but if you need to use this code in a closed commercial project, please contact me, so I can consider changing it to the MIT License :slightly_smiling_face:.
