export interface IOptions {
	theme: 'dark' | 'light';
	watch: boolean;
	template: 'standard' | string;
	colors: { [key: string]: string };
	'code-highlighter': 'prism';
	'code-highlighter-options': { [key: string]: any };
	'base-url': null | string;
	examples: null | string;
	'show-source-for-example': boolean;
	'generate-api': boolean;
	'api-section': string;
	plugins: Array<string | [string, false | { [key: string]: any }]>;
	excludes: string[];

	_: [string, string | undefined];
}


export interface TemplateData {
	name: string;
	html: string;

	assets?: {
		js?: string[];
		css?: string[];
		images?: string[];
	},
}
