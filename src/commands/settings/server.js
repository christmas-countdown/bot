/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const {
	Argument,
	Command,
	Flag
} = require('discord-akairo');
const {
	MessageEmbed
} = require('discord.js');

const {
	I18n
} = require('i18n');
const i18n = new I18n(require('../../bot').i18n);

class ServerSettingsCommand extends Command {
	constructor() {
		super('server', {
			aliases: ['server'],
			description: 'Modify server settings',
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	*args(message) {
		const cmd = yield {
			type: [
				['server-set', 'set'],
				['server-reset', 'reset'],
			],
			otherwise: async () => { // could just return embed object if not for locales
		
				i18n.setLocale((await message.guild.settings()).locale || 'en-GB');
				const prefix = this.client.config.prefix;
				let set = this.handler.findCommand('server-set').description;
				let reset = this.handler.findCommand('server-set').description;

				return message.util
					.send(
						new MessageEmbed()
							.setColor(this.client.config.colour)
							.setTitle(i18n.__('Server settings'))
							.setDescription(i18n.__(
								`The \`%s\` command has the following subcommands:\n\n❯ \`set\` » ${set}\n❯ \`reset\` » ${reset}`,
								prefix + this.id))
							.addField(i18n.__('Usage'), `\`${prefix}server set <args>\``)
							.addField(i18n.__('Help'), `\`${prefix}help server\``)
							.setFooter(i18n.__(this.client.const.footer), this.client.user.displayAvatarURL())
					);
			},
		};

		return Flag.continue(cmd);
	}

	async exec() {
		return;
	}
}

module.exports = ServerSettingsCommand;