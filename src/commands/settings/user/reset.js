/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed, i18n: i18nOptions } = require('../../../bot');

const { I18n } = require('i18n');
const i18n = new I18n(i18nOptions);

class UserResetSettingsCommand extends Command {
	constructor() {
		super('user-reset', {
			aliases: ['user-reset'],
			category: 'hidden',
			description: {
				content: 'Reset server settings',
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}


	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');


		uSettings.destroy(); // delete


		let prefix = this.client.config.prefix;

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle(i18n.__(':white_check_mark: User settings reset'))
				.setDescription(i18n.__('Your settings have been reset to the defaults. Use `%s` to re-configure.', prefix + 'user set'))
		);

	}
}

module.exports = UserResetSettingsCommand;