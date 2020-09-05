/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');


class OnErrorListener extends Listener {
	constructor() {
		super('error', {
			emitter: 'client',
			event: 'error'
		});
	}

	exec(e) {
		this.client.log.error(e);
	}
}

module.exports = OnErrorListener;