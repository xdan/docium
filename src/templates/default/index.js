/*!
 * Docium (https://xdsoft.net/docium/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const marked = require('marked');
let prism = require('prismjs');
let loadLanguages = require('prismjs/components/');

loadLanguages(['javascript', 'jsx', 'css', 'markup', 'bash', 'json']);

marked.setOptions({
	highlight: function (code, lang) {
		if (prism.languages[lang]) {
			return prism.highlight(code, prism.languages[lang], lang);
		} else {
			return code;
		}
	}
});

module.exports = {
	name: 'Standard',
	html: './template.html',
	assets: {
		js: ['./assets/js/*'],
		css: [
			'./assets/css/*',
			'../../../node_modules/prismjs/themes/prism-tomorrow.css'
		],
		icons: ['./assets/icons/*']
	}
};
