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
const { Embed } = require('../../../bot');

const { stripIndents } = require('common-tags');

const I18n = require('../../../locales');

class ServerSettingsCommand extends Command {
	constructor() {
		super('server', {
			aliases: ['server'],
			category: 'settings',
			description: {
				content: 'Modify server settings',
				usage: '<command> [args]',
				examples: [
					'set timezone: America/New_York',
					'reset'
				]
			},
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.replace(' ', '').split(','), // bot owners are exempt 
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	*args(message) {
		const cmd = yield {
			type: [
				['server-setup', 'setup'],
				['server-set', 'set'],
				['server-reset', 'reset'],
			],
			otherwise: async () => { 

				let uSettings = await message.author.settings(),
					gSettings = await message.guild?.settings();
		
				const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');
		
				const prefix = gSettings?.prefix || this.client.config.prefix;

				let docs = this.client.config.docs.commands,
					moreInfo = 'Click subcommand for more information';

				return new Embed()
					.setTitle(i18n.__('settings.server.server'))
					.setDescription(i18n.__('settings.sub_cmds',
						`[\`${this.id}\`](${docs}#server)`,
						stripIndents`❯ [\`setup\`](${docs}#server-setup "server setup") » ${this.handler.findCommand('server-setup').description.content || moreInfo}
							❯ [\`set\`](${docs}#server-set "server set") » ${this.handler.findCommand('server-set').description.content || moreInfo}
							❯ [\`reset\`](${docs}#server-reset "server reset") » ${this.handler.findCommand('server-reset').description.content || moreInfo}`,
					))					
					.addField(i18n.__('settings.usage'), `\`${prefix}server <command> [args]\``)
					.addField(i18n.__('settings.help'), `\`${prefix}help server\``);
			},
		};

		return Flag.continue(cmd);
	}


}

module.exports = ServerSettingsCommand;