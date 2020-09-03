/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger();

class UnhandledRejectionListener extends Listener {
	constructor() {
		super('unhandledRejection', {
			event: 'unhandledRejection',
			emitter: 'process'
		});
	}

	exec(error) {
		log.warn(`${global.prefix} An error was not caught`);
		log.warn(`${global.prefix} Uncaught ${error.name}: ${error.message}`);
		log.error(error);
	}
}

module.exports = UnhandledRejectionListener;