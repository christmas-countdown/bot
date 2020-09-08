/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const {
	// Argument,
	Command,
} = require('discord-akairo');

const {
	Embed
} = require('../../../bot');

const {
	I18n
} = require('i18n');
const i18n = new I18n(require('../../../bot').i18n);

class ServerSetSettingsCommand extends Command {
	constructor() {
		super('server-set', {
			aliases: ['server-set'],
			description: 'Set server settings',
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [{
				id: 'prefix',
				match: 'option',
				flag: 'prefix:',
				// type: Argument.validate('string', (m, p, str) => str.length < 20),
			},
			{
				id: 'locale',
				match: 'option',
				flag: 'locale:',
				type: 'locale', // custom
				// type: 'lowercase'
			},
			{
				id: 'timezone',
				match: 'option',
				flag: 'timezone:',
				type: 'timezone', // custom
				// type: 'lowercase'
			},
			{
				id: 'channel',
				match: 'option',
				flag: 'channel:',
				type: 'channelMention', // textChannel
			},
			{
				id: 'role',
				match: 'option',
				flag: 'role:',
				type: 'roleMention', // role
			},
			{
				id: 'auto',
				match: 'option',
				flag: 'auto:',
				type: 'boolean',
			},
			{
				id: 'enabled',
				match: 'option',
				flag: 'enabled:',
				type: 'boolean'
			},
			{
				id: 'mention',
				match: 'option',
				flag: 'mention:',
				type: 'boolean',

			}
			],
		});

		this.examples = [
			'server set channel: #countdown enabled: true',
			'server set timezone: America/New_York'
		];
	}


	async exec(message, args) {
		let settings = await message.guild.settings();
		i18n.setLocale(settings.locale || 'en-GB');

		let invalid = [],
			counter = 0;

		for (let arg in args) {
			if (!args[arg]) {
				if (message.content.includes(arg + ':'))
					invalid.push([arg, 'Invalid input (see docs)']);
				continue;
			}

			switch (arg) {
			case 'prefix':
				if (args[arg].length > 20) {
					invalid.push([arg, 'Prefix is too long']);
					continue;
				}
				
				settings.set(arg, args[arg]);
				break;

			case 'locale': {
				settings.set(arg, args[arg]);
				break;
			}

			case 'timezone': {
				settings.set(arg, args[arg]);
				break;
			}

			case 'channel':
				settings.set(arg, args[arg].id);
				break;

			case 'role':
				if (!settings.get('premium')) {
					invalid.push([arg, ':star: This is a premium option']);
					continue;
				}
				settings.set(arg, args[arg].id);
				break;

			case 'auto':
				if (!settings.get('premium')) {
					invalid.push([arg, ':star: This is a premium option']);
					continue;
				}
				settings.set(arg[0], args[arg]);
				break;

			case 'enabled':
				if (!settings.get('channel')) {
					invalid.push([arg, 'Cannot enable countdown before channel is set']);
					continue;
				}
				settings.set(arg[0], args[arg]);
				break;

			case 'mention':
				if (!settings.get('premium')) {
					invalid.push([arg, ':star: This is a premium option']);
					continue;
				}
				if (!settings.get('role')) {
					invalid.push([arg, 'Cannot enable mentioning before role is set']);
					continue;
				}
				settings.set(arg[0], args[arg]);
				break;
			}

			counter++;
		}

		settings.save(); // update database

		if (invalid.length > 0) {
			let docs = this.client.config.docs.settings;
			let list = '';

			for (let i in invalid)
				list += `❯ [\`${invalid[i][0]}\`](${docs}/server#${invalid[i][0]}) » ${i18n.__(invalid[i][1])}\n`;

			message.util.send(
				new Embed()
					.setTitle(':x: Server settings')
					.setDescription(i18n.__('There were some issues with the provided options:\n%s\nClick on the blue setting name to see the documentation.',
						list
					))
			);
		}

		const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
		let embed = new Embed();

		if (counter === 0 && invalid.length === 0)
			embed
				.setTitle(i18n.__('Server settings'))
				.setDescription(i18n.__('Nothing changed.'));
		else
			embed
				.setTitle(i18n.__(':white_check_mark: Server settings updated'));
		
		for (let arg in args)
			if (arg === 'channel')
				embed.addField(i18n.__(capitalise(arg)), settings.get(arg) !== null ? `<#${settings.get(arg)}>` : i18n.__('none'), true);
			else if (arg === 'role')
				embed.addField(i18n.__(capitalise(arg)), settings.get(arg) !== null ? `<@!${settings.get(arg)}>` : i18n.__('none'), true);
			else 
				embed.addField(i18n.__(capitalise(arg)), settings.get(arg) !== null ? `\`${settings.get(arg)}\`` : i18n.__('none'), true);

		return message.util.send(embed);

	}
}

module.exports = ServerSetSettingsCommand;