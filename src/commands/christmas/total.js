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

class TotalCommand extends Command {
	constructor() {
		super('total', {
			aliases: ['total', 'live', 'time-left'],
			description: {
				content: 'Show total time left until Christmas, in the user\'s or server\'s timezone.',
				premium: false
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');

		let xmas = new Christmas(uSettings?.timezone || gSettings?.timezone),
			total = xmas.total.days_based;

		let verb = i18n.__n('is', 'are', total.days),
			days = i18n.__n('**%d** day', '**%d** days', total.days),
			hours = i18n.__n('**%d** hour', '**%d** hours', total.hours),
			minutes = i18n.__n('**%d** minute', '**%d** minutes', total.minutes),
			seconds = i18n.__n('**%d** second', '**%d** seconds', total.seconds);

		let text = i18n.__('There %s %s, %s, %s, and %s left until Christmas!', verb, days, hours, minutes, seconds),
			footer = i18n.__('View the live countdown at [%s](%s).', this.client.config.website.pretty, this.client.config.website.url);

		let embed = new Embed(uSettings, gSettings)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setURL(this.client.config.website.url + '/live')
			.setDescription(text + '\n\n' + footer)
			.setTimestamp();

		if (xmas.isToday)
			embed
				.setTitle(i18n.__('It\'s Christmas Day! :tada:'))
				.setDescription(text + `\n\n${i18n.__('Merry Christmas!')}` + `\n\n${footer}`);
		else if (xmas.isTomorrow)
			embed
				.setTitle(i18n.__('It\'s Christmas Eve!'));		
		else
			embed
				.setTitle(i18n.__('%s %s, %s, %s, %s left', verb, days, hours, minutes, seconds));

		// ❯ return a promise
		return message.util.send(embed);

	}
}

module.exports = TotalCommand;