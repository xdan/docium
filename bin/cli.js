#!/usr/bin/env node
/*!
 * Docium (https://xdsoft.net/docium/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const defaultConfig = require('../src/default.config');
const { output } = require('../src/modules/output');
const { Docium } = require('../src/docium');

const argv = yargs(hideBin(process.argv))
	.option('watch', {
		alias: 'w',
		describe: 'Watch changes',
		type: 'boolean',
		default: false
	})
	.option('debug', {
		alias: 'd',
		describe: 'Debug mode',
		type: 'boolean',
		default: false
	})
	.option('port', {
		alias: 'p',
		describe: 'Port for dev server',
		type: 'number',
		default: 8082
	})
	.option('show-source-for-example', {
		describe: 'Show sources in example',
		type: 'boolean',
		default: true
	})
	.option('config', {
		describe: 'Config file',
		type: 'string'
	})
	.option('excludes', {
		describe: 'Exclude directories',
		type: 'array'
	})
	.option('theme', {
		describe: 'Theme',
		type: 'string',
		choices: ['dark', 'light'],
		default: 'light'
	})
	.option('examples', {
		describe: 'Examples directory',
		type: 'string',
		default: './examples'
	})
	.version(require('../package').version)
	.default(defaultConfig)
	.epilogue('MIT')
	.usage('Usage: npx docium ./src').argv;

try {
	const generator = new Docium(argv);

	if (generator.options.watch) {
		generator.watch();
	} else {
		generator.run();
	}
} catch (e) {
	if (argv.debug) {
		console.error(e);
	} else {
		output.error('Error: \\s', e.message);
	}
}
