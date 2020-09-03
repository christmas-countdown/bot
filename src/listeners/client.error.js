/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger();

class OnErrorListener extends Listener {
	constructor() {
		super('error', {
			emitter: 'client',
			event: 'error'
		});
	}

	exec(e) {
		log.error(e);
	}
}

module.exports = OnErrorListener;