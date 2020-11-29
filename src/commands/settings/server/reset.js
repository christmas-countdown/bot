/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../../bot');

const I18n = require('../../../locales');

class ServerResetSettingsCommand extends Command {
	constructor() {
		super('server-reset', {
			aliases: ['server-reset'],
			category: 'hidden',
			description: {
				content: 'Reset server settings',
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


		// settings.destroy(); // delete
		// settings = await this.client.db.Guild.create();
		
		await this.client.db.Guild.update(require('../../../models/guild').defaults(message.guild), {
			where: {
				id: message.guild.id
			}
		});


		let prefix = this.client.config.prefix,
			docs = this.client.config.docs.commands;

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle(i18n.__('settings.server.reset.title'))
				.setDescription(i18n.__('settings.server.reset.description', `[\`${prefix}server set\`](${docs}#server-set)`))
		);

	}
}

module.exports = ServerResetSettingsCommand;