/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');


class OnRateLimitListener extends Listener {
	constructor() {
		super('rateLimit', {
			emitter: 'client',
			event: 'rateLimit'
		});
	}

	exec(limit) {
		this.client.log.warn(`Rate-limited!`);
		this.client.log.debug(limit);
	}
}

module.exports = OnRateLimitListener;