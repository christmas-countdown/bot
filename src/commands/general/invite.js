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

class InviteCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite', 'add'],
			description: {
				content: 'Add the bot your own server',
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();

		i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');

		return message.util.send(
			new Embed()
				.setTitle(i18n.__('Invite'))
				.setDescription(i18n.__('Add the Christmas Countdown bot to your own server: [invite](%s)', this.client.config.invite))
		);
	}
}

module.exports = InviteCommand;