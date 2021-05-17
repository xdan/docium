/*!
 * Docium (https://xdsoft.net/docium/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const path = require('path');
const Template = require('./modules/template');
const glob = require('glob-promise');
const { output } = require('./modules/output');
const fs = require('fs-extra');
const { existsSync } = require('fs');
const root = path.resolve(__dirname, '..');

class Docium {
	/**
	 * @type {IOptions}
	 */
	options = {};

	/**
	 * @type {string}
	 */
	distPath = process.cwd();

	/**
	 * @type {Template}
	 */
	template;

	/**
	 * @param {IOptions} options
	 */
	constructor(options) {
		this.options = options;

		this.distPath = path.resolve(
			process.cwd(),
			this.options._[1] || './dist'
		);

		this.sourcePath = path.resolve(
			process.cwd(),
			this.options._[0] || './'
		);

		if (!this.sourcePath || !existsSync(this.sourcePath)) {
			throw new Error('Source path should be valid directory');
		}

		this.template = this.makeTemplate();
	}

	async run() {
		await this.template.prepare(this.distPath);
		await this.writeMarkDownFiles();

		output.info('Finished');
	}

	/**
	 * @return {Template}
	 */
	makeTemplate() {
		const { options } = this;
		let templatePath = path.resolve(
			root,
			`src/templates/${options.template}`
		);

		if (!existsSync(templatePath)) {
			templatePath = path.resolve(process.cwd(), options.template);
		}

		if (!existsSync(templatePath)) {
			throw new Error('Need valid template name');
		}

		const template = new Template(templatePath);

		output.info('Template: \\s', template.name);

		return template;
	}

	async writeMarkDownFiles() {
		const markdownFiles = (
			await glob.promise(this.sourcePath + '/**/*.md')
		).filter(
			(filePath) =>
				!this.options.excludes.some((excludePath) => {
					if (excludePath.startsWith(path.sep)) {
						return filePath.indexOf(excludePath) === 0;
					}

					return filePath.includes(excludePath);
				})
		);

		return Promise.all(
			markdownFiles.map(async (filePath) => {
				const content = await fs.readFile(filePath, 'utf-8'),
					relativePayth = path.relative(this.sourcePath, filePath),
					directoryPath = path.dirname(relativePayth);

				let fileName = path.basename(
					relativePayth,
					path.extname(relativePayth)
				);

				if (fileName.toLowerCase() === 'readme') {
					fileName = 'index';
				}

				fs.ensureDir(path.resolve(this.distPath, directoryPath));

				return this.template.makeHTMlFile(
					path.resolve(
						this.distPath,
						directoryPath,
						`${fileName}.html`
					),
					content
				);
			})
		);
	}
}

module.exports.Docium = Docium;
