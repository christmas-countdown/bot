/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

class MusicStartCommand extends Command {
	constructor() {
		super('music-start', {
			aliases: ['music-start', 'music-play'],
			category: 'hidden',
			description: {
				content: 'Start the Christmas radio',
			},
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.replace(' ', '').split(','), // bot owners are exempt
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}


	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();

		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle('ok')
		);

	}
}

module.exports = MusicStartCommand;