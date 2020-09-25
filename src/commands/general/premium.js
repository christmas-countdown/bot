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
		
		i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');

		message.util.send(
			new Embed()
				.setTitle(i18n.__(':star: Get premium'))
				.setDescription(i18n.__('Donate [here](%s) to unlock additional features.', this.client.config.premium))
		);
	
	}
}

module.exports = PremiumCommand;