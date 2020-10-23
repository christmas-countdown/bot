/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

class PremiumCommand extends Command {
	constructor() {
		super('premium', {
			aliases: ['premium', 'donate'],
			description: {
				content: 'Get premium by donating',
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
				.setTitle(i18n.__('general.premium.title'))
				.setDescription(i18n.__('general.premium.description', this.client.config.premium))
		);
	
	}
}

module.exports = PremiumCommand;