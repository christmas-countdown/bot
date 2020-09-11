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

class ListLocalesCommand extends Command {
	constructor() {
		super('locales', {
			aliases: ['locales', 'list-locales', 'languages'],
			description: 'List all valid locales',
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
				.setTitle(i18n.__('Locales'))
				.addField(i18n.__('Valid locales'), i18n.getLocales().map(locale => `\`${locale}\``).join(', ')) // turn array into cool string
				.addField(i18n.__('Don\'t see your language?'), i18n.__('Click [here](%s).', this.client.config.docs.locales))
				.addField(i18n.__('Set the server language'), `[\`${prefix}server set locale: <locale>\`](${docs}#server-set)`)
				.addField(i18n.__('Set your personal language'), `[\`${prefix}user set locale: <locale>\`](${docs}#user-set)`)
		);

	}
}

module.exports = ListLocalesCommand;