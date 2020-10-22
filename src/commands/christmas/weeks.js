/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

const Christmas = require('../../modules/christmas');

class WeeksCommand extends Command {
	constructor() {
		super('weeks', {
			aliases: ['weeks', 'total-weeks', 'weeks-left'],
			description: {
				content: 'Show weeks left until Christmas, in the user\'s or server\'s timezone.',
				premium: false
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();

		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		let xmas = new Christmas(uSettings?.timezone || gSettings?.timezone),
			weeks = xmas.weeks;

		let text = i18n.__('christmas.weeks.text', weeks),
			footer = i18n.__('christmas.footer', this.client.config.website.pretty, this.client.config.website.url);

		let embed = new Embed(uSettings, gSettings)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setURL(this.client.config.website.url + '/total#weeks')
			.setDescription(text + '\n\n' + footer)
			.setTimestamp();

		if (xmas.isToday)
			embed
				.setTitle(i18n.__('christmas.xmas_day'))
				.setDescription(`${text}\n\n${i18n.__('christmas.merry_xmas')}\n\n${footer}`);
		else if (xmas.isTomorrow)
			embed
				.setTitle(i18n.__('christmas.xmas_eve'));
		else
			embed
				.setTitle(i18n.__('christmas.weeks.title', weeks));


		// ❯ return a promise
		return message.util.send(embed);

	}
}

module.exports = WeeksCommand;