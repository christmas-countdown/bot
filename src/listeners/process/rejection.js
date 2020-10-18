/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');


class UnhandledRejectionListener extends Listener {
	constructor() {
		super('unhandledRejection', {
			event: 'unhandledRejection',
			emitter: 'process'
		});
	}

	exec(error) {
		this.client.log.warn('An error was not caught');
		if (error instanceof Error)
			this.client.log.warn(`Uncaught ${error.name}: ${error.message}`);
		this.client.log.error(error);
	}
}

module.exports = UnhandledRejectionListener;