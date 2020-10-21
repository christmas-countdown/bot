/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

class ToggleCommand extends Command {
	constructor() {
		super('toggle', {
			aliases: ['toggle'],
			description: {
				content: 'Toggle the countdown',
			},
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}


	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		const prefix = gSettings?.prefix || this.client.config.prefix;

		if (!gSettings.channel)
			return message.util.send(
				new Embed()
					.setTitle(i18n.__(':x: Cannot enable countdown before channel is set'))
					.setDescription(i18n.__('Use %s to set the channel.', `[\`${prefix}server set\`](${this.client.config.docs.commands}#server-set)`))
			);

		gSettings.set('enabled', !gSettings.enabled);
		gSettings.save();

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle(i18n.__(':white_check_mark: Countdown %s', i18n.__(!gSettings.enabled ? 'disabled' : 'enabled')))
		);

	}
}

module.exports = ToggleCommand;