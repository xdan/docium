/*!
 * Docium (https://xdsoft.net/docium/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const fs = require('fs-extra');
const path = require('path');
const { existsSync, readFileSync } = require('fs');
const showdown = require('showdown'),
	converter = new showdown.Converter();
const glob = require('glob-promise');

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

	assets = { js: [], css: [] };

	/**
	 * @param {string} distPath
	 * @return {Promise<unknown>}
	 */
	async prepare(distPath) {
		if (this.data.assets) {
			await Promise.all(
				Object.keys(this.data.assets).map(async (key) => {
					const newPath = path.resolve(distPath, 'assets', key);

					await fs.ensureDir(newPath);

					const items = this.data.assets[key];

					return Promise.all(
						items.map(async (item) => {
							const files = await glob.promise(
								path.resolve(this.templatePath, 'assets', item)
							);

							return Promise.all(
								files.map(async (fileName) => {
									const relativePath = path.relative(
											this.templatePath,
											fileName
										),
										directoryPath =
											path.dirname(relativePath);

									await fs.ensureDir(
										path.resolve(distPath, directoryPath)
									);

									const assetFilePath = path.resolve(
										distPath,
										relativePath
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
			acc[key] = this.assets[key].map((assetFile) =>
				path.relative(path.dirname(filePath), assetFile)
			);

			return acc;
		}, {});

		return fs.writeFile(
			filePath,
			this.tpl
				.replace(
					'<!-- STYLES -->',
					replace.css
						.map(
							(relPath) =>
								`<link href='${relPath}' rel='stylesheet'/>`
						)
						.join('\n')
				)
				.replace(
					'<!-- SCRIPTS -->',
					replace.css
						.map((relPath) => `<script src='${relPath}'></script>`)
						.join('\n')
				)
				.replace('<!-- BODY -->', converter.makeHtml(content)),
			'utf-8'
		);
	}
}

module.exports = Template;
