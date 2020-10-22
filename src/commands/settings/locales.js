/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

class ListLocalesCommand extends Command {
	constructor() {
		super('locales', {
			aliases: ['locales', 'languages'],
			description: {
				content: 'List all valid locales',
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}


	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		let prefix = gSettings?.prefix || this.client.config.prefix,
			docs = this.client.config.docs.commands;

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle(i18n.__('settings.locales.title'))
				.addField(i18n.__('settings.locales.fields.valid_locales'), I18n.locales.map(locale => `\`${locale}\``).join(', ')) // turn array into cool string
				.addField(i18n.__('settings.locales.fields.missing.title'), i18n.__('settings.locales.fields.missing.click_here', this.client.config.docs.locales))
				.addField(i18n.__('settings.locales.fields.set_serve'), `[\`${prefix}server set locale: <locale>\`](${docs}#server-set)`)
				.addField(i18n.__('settings.locales.fields.set_user'), `[\`${prefix}user set locale: <locale>\`](${docs}#user-set)`)
		);

	}
}

module.exports = ListLocalesCommand;