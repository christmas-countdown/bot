/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../../bot');

const { I18n } = require('i18n');
const i18n = new I18n(require('../../../bot').i18n);

class ServerSetSettingsCommand extends Command {
	constructor() {
		super('server-reset', {
			aliases: ['server-reset'],
			description: 'Reset server settings',
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}


	async exec(message) {

		let settings = await message.guild.settings();
		settings.destroy(); // delete
		settings = await this.client.db.Guild.create(require('../../../models/guild').defaults(message.guild));
		let prefix = this.client.config.prefix;

		i18n.setLocale(settings.locale || 'en-GB');

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle(i18n.__(':white_check_mark: Server settings reset'))
				.setDescription(i18n.__('This server\'s settings have been reset to the defaults. Use `%s` to re-configure.', prefix + 'server set'))
		);

	}
}

module.exports = ServerSetSettingsCommand;