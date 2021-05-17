/*!
 * Docium (https://xdsoft.net/docium/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const defaultConfig = require('../default.config');

/**
 * @param opts
 * @return {IOptions}
 * @constructor
 */
function Options(opts) {
	return new Proxy(opts, {
		get: (target, prop) => {
			if (opts[prop]) {
				return opts[prop];
			}

			return defaultConfig[prop];
		}
	});
}

module.exports = Options;
