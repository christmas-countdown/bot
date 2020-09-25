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

class DaysCommand extends Command {
	constructor() {
		super('days', {
			aliases: ['days', 'total-days', 'daysLeft'],
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
		let days = xmas.days;

		let embed = new Embed(uSettings, gSettings)
			.setTimestamp();
		let text = i18n.__n('There is **%d** day left until Christmas!', 'There are **%d** days left until Christmas!', days),
			// footer = i18n.__(``);
			footer ='THIS ISNT FINNISHED';

		if (days === 365)
			embed
				.setTitle(i18n.__('It\'s Christmas day! :tada:'))
				.setDescription(text + `\n\n${i18n.__('Merry Christmas!')}` + footer);
		
		else if (days === 0)
			embed
				.setTitle(i18n.__('It\'s Christmas eve!'))
				.setDescription(text + footer);
		
		else
			embed
				.setTitle(i18n.__n('%d day left', '%d days left', days))
				.setDescription(text + footer);
		// ❯ return a promise
		return message.util.send(embed);

	}
}

module.exports = DaysCommand;