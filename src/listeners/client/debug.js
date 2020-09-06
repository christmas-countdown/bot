/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');


class OnDebugListener extends Listener {
	constructor() {
		super('debug', {
			emitter: 'client',
			event: 'debug'
		});
	}

	exec(e) {
		this.client.log.debug(e);
	}
}

module.exports = OnDebugListener;