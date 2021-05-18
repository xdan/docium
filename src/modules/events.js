/*!
 * Docium (https://xdsoft.net/docium/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

class Events {
	#callbacks = {};

	on(eventName, callBack) {
		if (!this.#callbacks[eventName]) {
			this.#callbacks[eventName] = [];
		}

		this.#callbacks[eventName].push(callBack);
	}

	emit(eventName, ...args) {
		const list = this.#callbacks[eventName];

		if (list) {
			return list
				.map((clb) => clb(...args))
				.reduce((res, result) => res || result);
		}
	}
}

module.exports.Events = Events;
