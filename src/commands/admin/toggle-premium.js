/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

class TogglePremiumCommand extends Command {
	constructor() {
		super('toggle-premium', {
			aliases: ['toggle-premium'],
			description: {
				content: 'Enable/disable premium on for server',
			},
			ownerOnly: true,
			prefix: 'x!admin.',
			category: 'admin',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	async exec(message) {

		// ❯ return a promise
		return message.reply('ok');
		
	}
}

module.exports = TogglePremiumCommand;