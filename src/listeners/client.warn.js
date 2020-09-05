/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');


class OnWarnListener extends Listener {
	constructor() {
		super('warn', {
			emitter: 'client',
			event: 'warn'
		});
	}

	exec(e) {
		this.client.log.warn(e);
	}
}

module.exports = OnWarnListener;