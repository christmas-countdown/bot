/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class TogglePremiumCommand extends Command {
	constructor() {
		super('toggle-premium', {
			aliases: ['toggle-premium'],
			ownerOnly: true,
			prefix: 'x!admin.',
			// channel: 'guild',
			category: 'admin'
		});
	}

	async exec(message) {

		// ❯ return a promise
		return message.reply('ok');
		
	}
}

module.exports = TogglePremiumCommand;