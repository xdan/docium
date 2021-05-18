/*!
 * Docium (https://xdsoft.net/docium/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const fs = require('fs-extra');
const path = require('path');
const { existsSync, readFileSync } = require('fs');
const marked = require('marked');
const glob = require('glob-promise');
const { root } = require('../consts');

class Template {
	/**
	 * @type TemplateData
	 */
	data;

	get name() {
		return this.data.name;
	}

	/**
	 * @type {string}
	 */
	tpl = '';

	/**
	 * @type {string}
	 */
	sidebar = '';

	/**
	 * @type {string}
	 */
	templatePath = '';

	/**
	 * @type {Events}
	 */
	events;

	/**
	 * @type {IOptions}
	 */
	options;

	/**
	 * @param {IOptions} options
	 * @param {Events} events
	 */
	constructor(options, events) {
		this.options = options;
		this.events = events;

		this.templatePath = this.resolveTemplatePath();

		this.data = require(this.templatePath);

		this.events.on('postHTML', this.convertMarkdownToHTML);
	}

	resolveTemplatePath() {
		let templatePath = path.resolve(
			root,
			`src/templates/${this.options.template}`
		);

		if (!existsSync(templatePath) && this.options.template) {
			templatePath = path.resolve(process.cwd(), this.options.template);
		}

		if (!existsSync(path.resolve(templatePath, 'index.js'))) {
			throw new Error('Need valid template name');
		}

		return templatePath;
	}

	assets = { js: [], css: [], icons: [] };

	/**
	 * @param {string} distPath
	 * @return {Promise<unknown>}
	 */
	async prepare(distPath) {
		const htmlPath = path.resolve(this.templatePath, this.data.html);

		if (!existsSync(htmlPath)) {
			throw new Error('Need valid template HTML file');
		}

		this.tpl = readFileSync(htmlPath, 'utf-8');

		const sidebarPath = path.resolve(
			this.options.sourcePath,
			this.options.sidebar
		);

		if (existsSync(sidebarPath)) {
			this.sidebar = readFileSync(sidebarPath, 'utf-8');
		}

		if (this.data.assets) {
			await Promise.all(
				Object.keys(this.data.assets).map(async (key) => {
					const newPath = path.resolve(distPath, 'assets', key);

					await fs.ensureDir(newPath);

					const items = this.data.assets[key];

					return Promise.all(
						items.map(async (item) => {
							const files = await glob.promise(
								path.resolve(this.templatePath, item)
							);

							return Promise.all(
								files.map(async (fileName) => {
									const relativePath = path.relative(
										this.templatePath,
										fileName
									);

									let assetFilePath,
										rel = '';

									do {
										assetFilePath = path.resolve(
											distPath,
											rel,
											relativePath
										);

										rel += './sub';
									} while (
										!assetFilePath.startsWith(distPath)
									);

									assetFilePath = assetFilePath.replace(
										'node_modules',
										'assets'
									);

									await fs.ensureDir(
										path.dirname(assetFilePath)
									);

									if (!this.assets[key]) {
										this.assets[key] = [];
									}

									this.assets[key].push(assetFilePath);

									return fs.copy(fileName, assetFilePath);
								})
							);
						})
					);
				})
			);
		}
	}

	/**
	 *
	 * @param {string} filePath
	 * @param {string} content
	 * @return {Promise<void>}
	 */
	async makeHTMlFile(filePath, content) {
		const replace = Object.keys(this.assets).reduce((acc, key) => {
			acc[key] = this.assets[key].map((assetFile) => {
				const relPath = path.relative(
					path.dirname(filePath),
					assetFile
				);

				switch (key) {
					case 'css':
						return `<link href='${relPath}' rel='stylesheet'/>`;

					case 'icons': {
						return `<link rel='icon' type='image/png' href='${relPath}'/>`;
					}

					case 'script':
						return `<script src='${relPath}'></script>`;
				}
			});

			return acc;
		}, {});

		marked.use({
			renderer: {
				link: (href, title, text) => {
					if (!/^(http|https)?:\/\//.test(href)) {
						const fileRealPath = path.resolve(
								this.options.sourcePath,
								path.relative(this.options.distPath, filePath)
							),
							fullPath = path.resolve(
								this.options.sourcePath,
								href
							);

						href = path
							.relative(path.dirname(fileRealPath), fullPath)
							.replace(/readme\.md/i, 'index.html')
							.replace(/\.md$/i, '.html');
					}

					return `<a title='${title}' href='${href}'>${text}</a>`;
				}
			}
		});

		this.events.emit('addAssets', replace);

		const html = this.events.emit('postHTML', content) || content;

		const title = [this.options.title];

		for (let i = 1; i <= 3; i += 1) {
			if (html.includes('<h' + i)) {
				const [, subtitle] = RegExp(`<h${i}[^>]*>(.*)</h${i}>`).exec(
					html
				);
				title.unshift(subtitle);
			}
		}

		return fs.writeFile(
			filePath,
			this.tpl
				.replace(
					/<title>.*<\/title>/,
					`<title>${title.join(' - ')}</title>`
				)
				.replace('<!-- SIDEBAR -->', await this.getSideBar(filePath))
				.replace(
					'<!-- STYLES -->',
					replace.css.concat(replace.icons).join('\n')
				)
				.replace('<!-- SCRIPTS -->', replace.js.join('\n'))
				.replace('<!-- CONTENT -->', html),
			'utf-8'
		);
	}

	getSideBar() {
		return this.convertMarkdownToHTML(this.sidebar);
	}

	convertMarkdownToHTML(content) {
		return marked(content);
	}
}

module.exports = Template;
