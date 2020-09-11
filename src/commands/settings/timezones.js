/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const { I18n } = require('i18n');
const i18n = new I18n(require('../../bot').i18n);

class ListTimezonesCommand extends Command {
	constructor() {
		super('timezones', {
			aliases: ['timezones', 'list-timezones', 'zones'],
			description: 'List all valid timezones',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}


	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild.settings();
		
		i18n.setLocale(uSettings?.locale || gSettings.locale || 'en-GB');

		let prefix = gSettings.prefix || this.client.config.prefix,
			docs = this.client.config.docs.commands;

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle(i18n.__('Timezones'))
				.addField(i18n.__('Valid timezones'), i18n.__('The list is too long to send! Click [here](%s) to visit the docs.', this.client.config.docs.timezones))
				.addField(i18n.__('Set the server timezone'), `[\`${prefix}server set timezone: <timezone>\`](${docs}#server-set)`)
				.addField(i18n.__('Set your personal timezone'), `[\`${prefix}user set timezone: <timezone>\`](${docs}#user-set)`)
		);

	}
}

module.exports = ListTimezonesCommand;