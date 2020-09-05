/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { I18n } = require('i18n');
const i18n = new I18n(require('../../bot').i18n);

class TogglePremiumCommand extends Command {
	constructor() {
		super('toggle-premium', {
			aliases: ['toggle-premium', 'premium'],
			ownerOnly: true,
			prefix: 'x!admin.',
			category: 'admin'
		});
	}

	async exec(message) {

		// ❯ return a promise
		return message.reply('ok');
		
	}
}

module.exports = TogglePremiumCommand;