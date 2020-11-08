/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

class MusicSuggest extends Command {
	constructor() {
		super('music-suggest', {
			aliases: ['music-suggest', 'music-add'],
			category: 'hidden',
			description: {
				content: 'Suggest a Christmas song to be added to the radio playlist',
				usage: '<youtube url>'
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
				.setTitle('ok, sent.')
		);

	}
}

module.exports = MusicSuggest;