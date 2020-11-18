/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

class MusicStopCommand extends Command {
	constructor() {
		super('music-stop', {
			aliases: ['music-stop', 'music-pause'],
			category: 'hidden',
			description: {
				content: 'Stop the Christmas radio',
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

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle('ok, stopping.')
		);

	}
}

module.exports = MusicStopCommand;