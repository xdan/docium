/*!
 * Docium (https://xdsoft.net/docium/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
module.exports = {
	theme: 'light',
	template: 'default',
	debug: false,
	watch: false,
	sidebar: './_sidebar.md',
	colors: {
		'body-background': '#fff',
		'text-color': '#000',
		'link-color': '#555 #66f #111'
	},
	'code-highlighter': 'prism',
	'code-highlighter-options': {
		theme: 'darcula'
	},
	'base-url': null,
	examples: './examples',
	'show-source-for-example': true,
	'generate-api': true,
	'api-section': 'api',

	excludes: ['node_modules'],

	plugins: [
		[
			'docium-github-links',
			{
				stars: true,
				source: true
			}
		],
		'docium-allow-react-in-ex'
	]
};
