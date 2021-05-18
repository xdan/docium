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
const Options = require('./modules/options');
const watch = require('node-watch');
const { existsSync } = require('fs');
const express = require('express');
const open = require('open');
const { Events } = require('./modules/events');

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
	 * @type {Events}
	 */
	events = new Events();

	/**
	 * @param {IOptions} options
	 */
	constructor(options) {
		this.options = new Options(options);

		this.distPath = path.resolve(
			process.cwd(),
			this.options._[1] || './dist'
		);
		this.options.distPath = this.distPath;

		this.sourcePath = path.resolve(
			process.cwd(),
			this.options._[0] || './'
		);

		this.options.sourcePath = this.sourcePath;

		if (!this.sourcePath || !existsSync(this.sourcePath)) {
			throw new Error('Source path should be valid directory');
		}

		this.template = this.makeTemplate();
	}

	async run() {
		await this.template.prepare(this.distPath);
		await this.writeMarkDownFiles(await this.findMarkDownFiles());

		output.info('Build: \\s', new Date().toTimeString());
	}

	async watch() {
		const promisesResolvers = [],
			resolvePromise = () => promisesResolvers.forEach((clb) => clb()),
			waitPromise = () =>
				new Promise((res) => {
					promisesResolvers.push(res);
				});

		if (this.options.port) {
			const app = express();
			app.use(
				express.static(this.distPath, {
					maxAge: 0
				})
			);

			this.events.on('addAssets', (replace) => {
				replace.js.push(
					`<script>${fs.readFileSync(
						path.resolve(__dirname, './dev/dev.js'),
						'utf-8'
					)}</script>`
				);
			});

			app.get('/api/long-pull', async (req, res) => {
				await waitPromise();
				res.send('Sent data!');
			});

			await this.run();

			app.listen(this.options.port, () => {
				open('http://localhost:' + this.options.port);

				output.info(
					'Dev server v.\\s  http://localhost:\\s',
					require('../package.json').version,
					this.options.port
				);
			});
		} else {
			await this.run();
		}

		watch(
			this.sourcePath,
			{
				encoding: 'utf-8',
				recursive: true,
				filter: (filePath) => {
					return (
						/\.(md)$/i.test(filePath) &&
						!/^_/i.test(path.basename(filePath))
					);
				}
			},
			async (type, name) => {
				const mdPath = path.relative(this.sourcePath, name);

				output.info(`${type}:\\s`, mdPath);

				await this.writeMarkDownFiles([mdPath]);
				resolvePromise();

				output.info('ReBuild: \\s', new Date().toTimeString());
			}
		);

		watch(
			this.sourcePath,
			{
				encoding: 'utf-8',
				recursive: true,
				filter: (filePath) => {
					return (
						/\.(md)$/i.test(filePath) &&
						/^_/i.test(path.basename(filePath))
					);
				}
			},
			async () => {
				await this.run();
				resolvePromise();

				output.info('Full ReBuild: \\s', new Date().toTimeString());
			}
		);

		watch(
			this.sourcePath,
			{
				encoding: 'utf-8',
				recursive: true,
				filter: (file) => {
					if (file.indexOf(this.distPath) === 0) {
						return false;
					}

					return /\.(js|css|gif|png|jpg)$/.test(file);
				}
			},
			async (type, name) => {
				const filePath = path.relative(this.sourcePath, name);

				output.info(`${type}:\\s`, filePath);

				await this.template.prepare(this.distPath);
				resolvePromise();
			}
		);
	}

	/**
	 * @return {Template}
	 */
	makeTemplate() {
		const { options } = this;
		const template = new Template(options, this.events);

		output.info('Template: \\s', template.name);

		return template;
	}

	/**
	 * @return {Promise<string[]>}
	 */
	async findMarkDownFiles() {
		return (await glob.promise(this.sourcePath + '/**/*.md')).filter(
			(filePath) =>
				!path.basename(filePath).startsWith('_') &&
				!this.options.excludes.some((excludePath) => {
					if (excludePath.startsWith(path.sep)) {
						return filePath.indexOf(excludePath) === 0;
					}

					return filePath.includes(excludePath);
				})
		);
	}

	/**
	 * @param {string[]} markdownFiles
	 * @return {Promise<unknown[]>}
	 */
	async writeMarkDownFiles(markdownFiles) {
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
