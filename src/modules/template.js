const fs = require('fs-extra');
const path = require('path');
const { existsSync, readFileSync } = require('fs');
const showdown = require('showdown'),
	converter = new showdown.Converter();

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
	templatePath = '';

	/**
	 * @param {string} templatePath
	 */
	constructor(templatePath) {
		this.templatePath = templatePath;

		this.data = require(templatePath);

		const htmlPath = path.resolve(templatePath, this.data.html);
		if (!existsSync(htmlPath)) {
			throw new Error('Need valid template HTML file');
		}

		this.tpl = readFileSync(htmlPath, 'utf-8');
	}

	/**
	 * @param {string} distPath
	 * @return {Promise<unknown>}
	 */
	async prepareDist(distPath) {
		if (this.data.assets) {
			await Promise.all(
				Object.keys(this.data.assets).map(async key => {
					const newPath = path.resolve(distPath, 'assets', key);

					await fs.ensureDir(newPath);
					await fs.copy(
						path.resolve(this.templatePath, 'assets', key),
						newPath
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
		return fs.write(
			filePath,
			this.tpl.replace('<!-- BODY -->', converter.makeHtml(content))
		);
	}
}

module.exports = Template;
