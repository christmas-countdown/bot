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

class ServerSetupCommand extends Command {
	constructor() {
		super('server-setup', {
			aliases: ['server-setup'],
			description: 'Configure the bot\'s server settings',
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}


	async exec(message, args) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild.settings();
		
		i18n.setLocale(uSettings?.locale || gSettings.locale || 'en-GB');

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle(i18n.__('SETUP PROMPT'))
		);

	}
}

module.exports = ServerSetupCommand;