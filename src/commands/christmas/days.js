/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed, i18n: i18nOptions } = require('../../bot');

const { I18n } = require('i18n');
const i18n = new I18n(i18nOptions);

const Christmas = require('../../modules/christmas');

class PingCommand extends Command {
	constructor() {
		super('days', {
			aliases: ['days', 'daysLeft'],
			description: {
				content: 'Show days left until Christmas',
				premium: false
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');

		let xmas = new Christmas(uSettings?.timezone || gSettings?.timezone);
		console.log(xmas.live);
		// ❯ return a promise
		return message.util.send(
			new Embed(uSettings, gSettings)
				.setDescription(xmas.days.number)
		);
		// m.edit
	}
}

module.exports = PingCommand;