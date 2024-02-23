# email-protector.js

This is a JavaScript library for protecting email addresses included on webpages from spam bots.
It uses different obfuscation techniques to hide the real email address and `mailto` links, as well as methods for correct presentation of them to the user.
The trick is to use simple [ROT](https://en.wikipedia.org/wiki/ROT13) encoding function (i.e. [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher)),
to hide an email address and decode it whenever the user clicks on a link (any mouse button click is counted here, because of the usage of the `mousedown` event).

There are also some other obfuscation techniques used to protect email addresses as CSS reverse technique, hidden `<span>` addition, and HTML comments insertion.
Look at the [Resources](#resources) section for more details about the subject, especially the first two articles.

## Table of contents

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Preparing email address](#preparing-email-address)
* [Inserting email address into HTML document](#inserting-email-address-into-HTML-document)
  * [Using `append()` method](#using-append()-method)
  * [Using `write()` method](#using-write()-method)
* [Email parameters](#email-parameters)
* [Configuration parameters](#configuration-parameters)
  * [`code`](#code)
  * [`linkLabel`](#linklabel)
  * [`cssReverse`](#cssreverse)
  * [`hiddenSpan`](#hiddenspan)
  * [`htmlcomments`](#htmlcomments)
* [Using global parameters and configuration](#using-global-parameters-and-configuration)
* [Code examples](#code-examples)
* [Resources](#resources)
* [License](#license)


## Prerequisites

There are no prerequisites for the library to use other than JavaScript enabled in a browser.
The library was compiled with [Babel transcompiler](https://babeljs.io) with default parameters of [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env) preset, so it should run without issues on any modern web browser.
It was tested on:

* Mozilla Firefox v79
* Google Chrome v80
* Opera v67

The library was minified using [Terser Plugin](https://webpack.js.org/plugins/terser-webpack-plugin) in [webpack](https://webpack.js.org/configuration/optimization/) with default parameters. Source map was included in the production build (see `build` directory). You can find webpack configuration files attached to the repository root folder.


## Installation

To use the library with your HTML documents include the `email-protector.js` file (`build` directory) using `<script>` tag.
You can download it and include as a local file (this way future changes to the project will not break your webpage):
```html
<script src="assets/js/email-protector.js"></script>
```
Or you can attach the library with the global link as well:
```html
<script src="https://raw.githubusercontent.com/bearbyt3z/email-protector.js/master/build/email-protector.js"></script>
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

See [Configuration Parameters](#configuration-parameters) section explaining the usage of the `code` and the rest of configuration parameters.


## Inserting email address into HTML document

There are two methods available to insert your email address link into HTML document.


### Using `append()` method

The first one assumes creating a HTML element with an arbitrary ID and calling `append()` function with the ID and the encoded email address as parameters:
```html
<body>
  <!-- script with append() function can be placed anywhere in a HTML document -->
  <script>
    EmailProtector.append('email-protector', 'hfre@qbznva.arg');
  </script>
  ...
  <p>
    Please contact me at <span id="email-protector"></span>
  </p>
</body>
```
Please keep in mind, that the `mailto` link will be added as the last child of the provided HTML element. This is similar behavior as in case of [`Node.appendChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) method, which is called by the `append()` method.

This function uses [`window.onload`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload) event to add the email link to the specified HTML element, so it can be executed anywhere in a HTML document.

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

**Notice: Please keep in mind that `id` attribute of every anchor tag is randomly generated, and should be unique across the entire webpage.**


### Using `write()` method

Second technique uses [`document.write()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write) method to print the `mailto` link exactly after the `<script>` tag, where the `EmailProtector.write()` method was called:

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

The above code will generate a very similar result to the previous method:

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

You can specify `mailto` link parameters using first (in case of `write()`) or second (in case of `aplly()`) argument when calling each method.
The argument must be a string representing encoded email address or an object with any supported link parameters:
* `email` - an ROT encoded email address;
* `subject` - the subject of an email message (should not be encoded);
* `body` - the body of an email (not encoded);
* `cc` - carbon copy of an email (also ROT encoded);
* `bcc` - blind carbon copy (also ROT encoded).

Here is an example of all the above mentioned `mailto` link parameters passed to the `write()` function:
```javascript
EmailProtector.write({
  email:   'hfre@qbznva.arg',
  subject: 'Message from www',
  body:    'Hi, I\'m contacting you',
  cc:      'hfre2@qbznva.arg',
  bcc:     'hfre3@qbznva.arg'
});
```
The `cc` and `bcc` parameters in the example correspond to `user2@domain.net` and `user3@domain.net` addresses respectively.
As stated above they also have to be ROT encoded, because they will be subjected to the decoding process in the same way the main email address is (we don't want to expose them to spam bots either).


## Configuration parameters

The last parameter of the `append()` and `write()` functions specifies the `EmailProtector` configuration object.
There are several config options to choose from that allow to adjust encoding and the display value of the generated `mailto` link.


### `code`

Specifies the code value for email decoding i.e. [Caesar cipher code](https://en.wikipedia.org/wiki/Caesar_cipher).
You have to pass the code value that will revert back the encoding, so this parameter is crucial for proper work of the `EmailProtector.decode()` function.

The code value can be computed as the difference between `26` and the code value used in encoding (modulo 26).
For example if the code `11` was used to encode an email address, then the code `15` should be used for decoding.
You can also use numbers greater than 26, but the `rot()` and decoding function will do modulo operation anyway.

The default value is `13` i.e. [ROT13](https://en.wikipedia.org/wiki/ROT13) encoding is assumed.
Notice that when encoding by `13` the decoder code value will be the same.


### `linkLabel`

Specifies the display value used as the `mailto` link label. If set the provided email address will not be printed inside the email link. Instead the value of this parameter will be used.

The default value is `undefined` i.e. the email address is used as the link label.


### `cssReverse`

Use the CSS reverse obfuscation technique to hide the real email address displayed as the `mailto` link label.
The email address is written in reverse order and the following CSS code is used to display it right to a user:
```css
#some-unique-id {
  unicode-bidi: bidi-override;
  direction: rtl;
}
```
The default value is `true`.

This option is taken into account only when `linkLabel` is unset (undefined).


### `hiddenSpan`

Inserts a `<span>` element in the middle of the `mailto` link label (before `@` char).
The `span` is hidden using CSS `display: none` property, so it is invisible for a user.

The default value is `true`.

This option is taken into account only when `linkLabel` is unset (undefined).


### `htmlComments`

Adds another obfuscation technique using HTML comments. Dot (`.`) and at (`@`) signs are extended with comments in the following manner:
```html
<!-- pre @ -->@<!-- post @ -->
```
Furthermore there is another comment inserted at the beginning of the `mailto` link label with some fake (generated) email address, e.g.:
```html
<!-- mailto:spdgsl@mkuhrekslo.euh -->
```

The default value of this parameter is `true`.

This option is taken into account only when `linkLabel` is unset (undefined).


## Using global parameters and configuration

Email message parameters for the library as well as configuration can be set as global using `setGlobalParams()` and `setGlobalConfig()` methods respectively.

```html
<head>
  ...
  <script>
    EmailProtector.setGlobalParams({ email: 'dpnzyo.fdpc@ozxlty.ype', subject: 'Message from www' });
    EmailProtector.setGlobalConfig({ code: 15, hiddenSpan: false, htmlComments: false });
  </script>
</head>
<body>
  <p>
    Please contact me at
    <script>
      EmailProtector.write(); // calling without the email parameter
    </script>
  </p>
  ...
  <p>
    My email address:
    <script>
      EmailProtector.write();
    </script>
  </p>
  ...
</body>
```

To reset global parameters use `resetParams()` method and to reset global configuration use `resetConfig()` method:
```javascript
EmailProtector.resetParams();
EmailProtector.resetConfig();
```

After resetting global parameters you cannot call `write()` method without specifying the value of the email address parameter:
```javascript
EmailProtector.write(); // this will throw a TypeError: "EmailProtector: undefined is not a valid email address"
```


## Code examples

Here are some examples of tuning the output result from the library.
To keep it simple only the email address is passed as an email link parameter.
Please look also at the `build/examples.html` file where you can find more explanatory examples of the library usage.

---

JavaScript input:
```javascript
EmailProtector.write('hfre@qbznva.arg', {
  linkLabel: 'Click here to contact me'
});
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
HTML Result (+ CSS style for text reversing):
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
HTML result (+ CSS style for hiding the `<span>` element):
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

This project is licensed under the GNU General Public License v3.0 &ndash; see the [LICENSE.md](LICENSE.md) file for details.

I really like the open-source software paradigm, but if you need to use this code in a closed commercial project, please contact me, so I can consider changing it to the MIT License :smirk:
