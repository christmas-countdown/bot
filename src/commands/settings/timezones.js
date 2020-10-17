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

class ListTimezonesCommand extends Command {
	constructor() {
		super('timezones', {
			aliases: ['timezones', 'zones'],
			description: {
				content: 'List all valid timezones',
				usage: '[country]',
				examples: [
					'US'
				]
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: 
			[
				{
					id: 'country',
					type: 'countryCode'
				}
			]
		});
	}


	async exec(message, { country }) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');

		let prefix = gSettings?.prefix || this.client.config.prefix,
			docs = this.client.config.docs.commands,
			list;

		let embed = new Embed()
			.setTitle(i18n.__('Timezones'))
			.addField(i18n.__('Set the server timezone'), `[\`${prefix}server set timezone: <timezone>\`](${docs}#server-set)`)
			.addField(i18n.__('Set your personal timezone'), `[\`${prefix}user set timezone: <timezone>\`](${docs}#user-set)`);
			

		if (country) {
			list = require('../../storage/timezones.json').byCountry[country].map(z => `\`${z}\``).join(', ');
			embed.setTitle(i18n.__('Timezones of %s', country));

			if (list.length > 1024)
				list = i18n.__('The list is too long to send! Click [here](%s) to visit the docs.',
					this.client.config.docs.timezones);
			embed.addField(i18n.__('Valid timezones'), list);
		} else {
			embed
				.setURL(this.client.config.docs.timezones)
				.setDescription(
					i18n.__('Use %s to list timezones by country, where `<country>` is a country code (examples: `US`, `GB`,`DE`, `FR`, or `RU`)',
						`[\`${prefix}timezones <country>\`](${docs}#timezones)`));
		}

		

		return message.util.send(
			embed
		);
		

	}
}

module.exports = ListTimezonesCommand;