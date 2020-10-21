/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

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

		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		return message.util.send(
			new Embed()
				.setTitle(i18n.__('general.invite.title'))
				.setDescription(i18n.__('general.invite.description', this.client.config.invite))
		);
	}
}

module.exports = InviteCommand;