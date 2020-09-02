/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger();

class OnRateLimitListener extends Listener {
	constructor() {
		super('rateLimit', {
			emitter: 'client',
			event: 'rateLimit'
		});
	}

	exec(limit) {
		log.warn(`${global.prefix} Rate-limited!`);
		log.debug(limit);
	}
}

module.exports = OnRateLimitListener;