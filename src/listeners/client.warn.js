/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger();

class OnWarnListener extends Listener {
	constructor() {
		super('warn', {
			emitter: 'client',
			event: 'warn'
		});
	}

	exec(e) {
		log.warn(e);
	}
}

module.exports = OnWarnListener;