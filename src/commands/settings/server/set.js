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

const { Embed } = require('../../../bot');

const I18n = require('../../../locales');

class ServerSetSettingsCommand extends Command {
	constructor() {
		super('server-set', {
			aliases: ['server-set'],
			category: 'hidden',
			description: {
				content: 'Set server settings',
				usage: '[settings]',
				examples: [
					'set channel: #countdown enabled: true',
					'set timezone: America/New_York'
				]
			},
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
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
	}


	async exec(message, args) {
		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		let invalid = [],
			counter = 0;

		for (let arg in args) {
			if (!args[arg]) {
				if (message.content.includes(arg + ':'))
					invalid.push([arg, i18n.__(`settings.options.${arg}.error`) || i18n.__('settings.invalid')]);
				continue;
			}

			if (this.client.config.premium_options.includes(arg) && !gSettings.premium) {
				invalid.push([arg, i18n.__('settings.premium')]);
				continue;
			}

			switch (arg) {
			case 'prefix':
				if (args[arg].length > 20) {
					invalid.push([arg, i18n.__('settings.options.prefix.error')]);
					continue;
				}	
				gSettings.set(arg, args[arg]);
				break;

			case 'channel':
				gSettings.set(arg, args[arg].id);
				break;

			case 'role':
				gSettings.set(arg, args[arg].id);
				break;

			case 'auto':
				gSettings.set(arg, args[arg][0]);
				break;

			case 'enabled':
				if (!gSettings.channel) {
					invalid.push([arg, i18n.__('settings.options.enabled.channel_not_set')]);
					continue;
				}
				gSettings.set(arg, args[arg][0]);
				break;

			case 'mention':
				if (!gSettings.role) {
					invalid.push([arg, i18n.__('settings.options.mention.role_not_set')]);
					continue;
				}
				gSettings.set(arg, args[arg][0]);
				break;

			default:
				gSettings.set(arg, args[arg]);
			}

			counter++;
		}

		gSettings.save(); // update database

		if (invalid.length > 0) {
			let docs = this.client.config.docs.settings;
			let list = '';

			for (let i in invalid)
				list += `❯ [\`${invalid[i][0]}\`](${docs}/server#${invalid[i][0]}) » ${invalid[i][1]}\n`;

			return message.util.send(
				new Embed()
					.setTitle(i18n.__('settings.server.set.invalid.title'))
					.setDescription(i18n.__('settings.server.set.invalid.description', list))
			);
		}

		// const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
		// const capitalise = (str) => str.replace(/^\w/, first => first.toUpperCase());

		let embed = new Embed();

		if (counter === 0)
			embed
				.setTitle(i18n.__('settings.server.set.no_change.title'))
				.setDescription(i18n.__('settings.server.set.no_change.description'));
		else
			embed
				.setTitle(i18n.__('settings.server.set.success.title'));
		
		for (let arg in args) {
			let title = i18n.__(`settings.options.${arg}.title`);
			if (arg === 'channel')
				embed.addField(title, gSettings.get(arg) !== null ? `<#${gSettings.get(arg)}>` : i18n.__('none'), true);
			else if (arg === 'role')
				embed.addField(title, gSettings.get(arg) !== null ? `<@&${gSettings.get(arg)}>` : i18n.__('none'), true);
			else
				embed.addField(title, gSettings.get(arg) !== null ? `\`${gSettings.get(arg)}\`` : i18n.__('none'), true);
		}
			

		return message.util.send(embed);

	}
}

module.exports = ServerSetSettingsCommand;