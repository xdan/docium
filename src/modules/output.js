const chalk = require('chalk');

class Output {
	log(message, color, ...values) {
		values.forEach(value => {
			message = message.replace('\\s', color(value))
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
