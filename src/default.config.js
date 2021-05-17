module.exports = {
	theme: 'light',
	template: 'standard',
	watch: false,
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

	excludes: [
		'node_modules'
	],

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
