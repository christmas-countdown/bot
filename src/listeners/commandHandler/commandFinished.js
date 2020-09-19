/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');

class OnCommandFinishedListener extends Listener {
	constructor() {
		super('commandFinished', {
			emitter: 'commandHandler',
			event: 'commandFinished'
		});
	}

	async exec(message, command) {
		this.client.log.console(
			this.client.log.f(`&7${message.author.tag}&f used the &e${command.id}&f command`));
		
	}
}

module.exports = OnCommandFinishedListener;