/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const {
	Argument,
	Command,
} = require('discord-akairo');
const {
	MessageEmbed
} = require('discord.js');

const {
	I18n
} = require('i18n');
const i18n = new I18n(require('../../../bot').i18n);

class ServerSetSettingsCommand extends Command {
	constructor() {
		super('server-reset', {
			aliases: ['server-reset'],
			description: 'Reset server settings',
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
		});
	}


	async exec(message) {

		i18n.setLocale((await message.guild.settings()).locale || 'en-GB');

		// ❯ return a promise
		return message.util.send(
			new MessageEmbed()
				.setColor(this.client.config.colour)
				.setTitle('RESET')
		);

	}
}

module.exports = ServerSetSettingsCommand;