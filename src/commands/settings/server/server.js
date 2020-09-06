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

const { I18n } = require('i18n');
const i18n = new I18n(require('../../../bot').i18n);

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
				['server-set', 'set'],
				['server-reset', 'reset'],
			],
			otherwise: async () => { 

				let settings = await message.guild.settings();
				i18n.setLocale(settings.locale || 'en-GB');
				const prefix = settings.prefix || this.client.config.prefix;

				let docs = this.client.const.docs.commands,
					set = this.handler.findCommand('server-set').description || 'Click subcommand for more information',
					reset = this.handler.findCommand('server-reset').description || 'Click subcommand for more information';

				return new Embed()
					.setTitle(i18n.__('Server settings'))
					.setDescription(i18n.__(
						'The \`%s\` command has the following subcommands:\n\n%s',
						`[\`${this.id}\`](${docs}#server)`,
						`❯ [\`set\`](${docs}#server-set) » ${set}\n❯ [\`reset\`](${docs}#server-reset) » ${reset}`))
					.addField(i18n.__('Usage'), `\`${prefix}server set <args>\``)
					.addField(i18n.__('Help'), `\`${prefix}help server\``);
			},
		};

		return Flag.continue(cmd);
	}


}

module.exports = ServerSettingsCommand;