/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

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
		
		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		let prefix = gSettings?.prefix || this.client.config.prefix,
			docs = this.client.config.docs.commands,
			list;

		let embed = new Embed()
			.setTitle(i18n.__('settings.timezones.title'))
			.addField(i18n.__('settings.timezones.fields.set_server'), `[\`${prefix}server set timezone: <timezone>\`](${docs}#server-set)`)
			.addField(i18n.__('settings.timezones.fields.set_user'), `[\`${prefix}user set timezone: <timezone>\`](${docs}#user-set)`);
			

		if (country) {
			list = require('../../storage/timezones.json').byCountry[country].map(z => `\`${z}\``).join(', ');
			embed.setTitle(i18n.__('settings.timezones.title_by_country', country));

			if (list.length > 1024)
				list = i18n.__('settings.timezones.fields.list.too_long', this.client.config.docs.timezones);
			embed.addField(i18n.__('settings.timezones.fields.list.title'), list);
		} else {
			embed
				.setURL(this.client.config.docs.timezones)
				.setDescription(i18n.__('settings.timezones.description', `[\`${prefix}timezones <country>\`](${docs}#timezones)`));
		}

		return message.util.send(embed);
		
	}
}

module.exports = ListTimezonesCommand;