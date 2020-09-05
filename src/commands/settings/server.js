/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Argument, Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { I18n } = require('i18n');
const i18n = new I18n(require('../../bot').i18n);

class ServerSettingsCommand extends Command {
	constructor() {
		super('server', {
			aliases: ['server'],
			description: 'Configure server settings',
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
			args: [
				{
					id: 'cmd',
					type: ['set', 'reset'],
				},
				{
					id: 'prefix',
					match: 'option',
					flag: 'prefix',
					type: Argument.validate('string', (m, p, str) => str.length < 20),
				},
				{
					id: 'locale',
					match: 'option',
					flag: 'locale',
					type: 'locale', // custom
				},
				{
					id: 'timezone',
					match: 'option',
					flag: 'timezone',
					type: 'timezone', // custom
				},
				{
					id: 'channel',
					match: 'option',
					flag: 'channel',
					type: ['textChannel', 'channelMention'],
				},
				{
					id: 'role',
					match: 'option',
					flag: 'role',
					type: ['role', 'roleMention'],
				},
				{
					id: 'enabled',
					match: 'option',
					flag: 'enabled',
					type: 'boolean',
				},
				{
					id: 'mention',
					match: 'option',
					flag: 'mention',
					type: 'boolean',
				}
			],
		});
	}

	async exec(message) {
		const { client } = message;

		i18n.setLocale((await message.guild.settings()).locale || 'en-GB');

		// PERMS
		// CMD?

		// ❯ return a promise
		return message.util.send(
			new MessageEmbed()
				.setColor(client.config.colour)
		);
		
	}
}

module.exports = ServerSettingsCommand;