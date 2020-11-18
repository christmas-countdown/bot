/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');
const utils = require('../../modules/utils');

const I18n = require('../../locales');

class NowPlayingCommand extends Command {
	constructor() {
		super('playing', {
			aliases: ['nowplaying', 'np'],
			description: {
				content: 'Show what song is currently playing on the radio.',
			},
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
				.setTitle('music.np.title')
		);
	}
}

module.exports = NowPlayingCommand;