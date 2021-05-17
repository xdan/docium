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
	.default(defaultConfig)
	.usage('Usage: npx docium ./src').argv;

try {
	const generator = new Docium(argv);
	generator.run();
} catch (e) {
	output.error('Error: \\s', e.message);
}
