/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const {
	Command,
	Flag
} = require('discord-akairo');
const { Embed } = require('../../bot');

const { stripIndents } = require('common-tags');

const I18n = require('../../locales');

class MusicCommand extends Command {
	constructor() {
		super('music', {
			aliases: ['music', 'radio'],
			description: {
				content: 'Christmas radio commands',
				usage: '<command> [args]',
				examples: [
					'start',
					'stop',
					'suggest'
				]
			},
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	*args(message) {
		const cmd = yield {
			type: [
				['music-start', 'start'],
				['music-start', 'play'],
				['music-stop', 'stop'],
				['music-stop', 'pause'],
				['music-suggest', 'suggest'],
				['music-suggest', 'add'],
			],
			otherwise: async () => {

				let uSettings = await message.author.settings(),
					gSettings = await message.guild?.settings();

				const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

				const prefix = gSettings?.prefix || this.client.config.prefix;

				let docs = this.client.config.docs.commands,
					moreInfo = 'Click subcommand for more information';

				return new Embed()
					.setTitle(i18n.__('music.music.title'))
					.setDescription(i18n.__('music.sub_cmds',
						`[\`${this.id}\`](${docs}#music)`,
						stripIndents`❯ [\`start\`](${docs}#music-start "music start") » ${this.handler.findCommand('music-start').description.content || moreInfo}
							❯ [\`stop\`](${docs}#music-stop "music stop") » ${this.handler.findCommand('music-stop').description.content || moreInfo}
							❯ [\`suggest\`](${docs}#music-suggest "music suggest") » ${this.handler.findCommand('music-suggest').description.content || moreInfo}`,
					))
					.addField(i18n.__('settings.usage'), `\`${prefix}music <command> [args]\``)
					.addField(i18n.__('settings.help'), `\`${prefix}help music\``);
			},
		};

		return Flag.continue(cmd);
	}


}

module.exports = MusicCommand;