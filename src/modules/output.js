/*!
 * Docium (https://xdsoft.net/docium/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const chalk = require('chalk');

class Output {
	log(message, color, ...values) {
		values.forEach((value) => {
			message = message.replace('\\s', color(value));
		});

		console.log(message);
	}

	info(message, ...values) {
		this.log(chalk.green(message), chalk.blue, ...values);
	}

	error(message, ...values) {
		this.log(chalk.red(message), chalk.hex('#ff00f0'), ...values);
	}
}

module.exports.output = new Output();
