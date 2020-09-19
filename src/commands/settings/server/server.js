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
const { Embed, i18n: i18nOptions } = require('../../../bot');

const { stripIndents } = require('common-tags');
const { I18n } = require('i18n');
const i18n = new I18n(i18nOptions);

class ServerSettingsCommand extends Command {
	constructor() {
		super('server', {
			aliases: ['server'],
			description: 'Modify server settings',
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
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
		
				i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');
		
				const prefix = gSettings?.prefix || this.client.config.prefix;

				let docs = this.client.config.docs.commands,
					moreInfo = 'Click subcommand for more information';

				return new Embed()
					.setTitle(i18n.__('Server settings'))
					.setDescription(i18n.__(
						'The %s command has the following subcommands:\n\n%s',

						`[\`${this.id}\`](${docs}#server)`,
						stripIndents`❯ [\`setup\`](${docs}#server-setup "server setup") » ${i18n.__(this.handler.findCommand('server-setup').description || moreInfo)}
							❯ [\`set\`](${docs}#server-set "server set") » ${i18n.__(this.handler.findCommand('server-set').description || moreInfo)}
							❯ [\`reset\`](${docs}#server-reset "server reset") » ${i18n.__(this.handler.findCommand('server-reset').description || moreInfo)}`,
					))					
					.addField(i18n.__('Usage'), `\`${prefix}server set <args>\``)
					.addField(i18n.__('Help'), `\`${prefix}help server\``);
			},
		};

		return Flag.continue(cmd);
	}


}

module.exports = ServerSettingsCommand;