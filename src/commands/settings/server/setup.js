/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../../bot');
const { MessageEmbed } = require('discord.js');

const config = require('../../../../config');

const I18n = require('../../../locales');

class ServerSetupCommand extends Command {
	constructor() {
		super('server-setup', {
			aliases: ['server-setup'],
			category: 'hidden',
			description: {
				content: 'Configure the bot\'s server settings using the setup prompt',
			},
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	async *args(message) {
		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		const timezone = yield { 
			type: 'timezone',
			prompt: {
				start: () => new MessageEmbed()
					.setColor(config.colour)
					.setDescription(i18n.__('settings.server.setup.prompts.timezone.prompt', config.docs.timezones)),
				retry: () => new MessageEmbed()
					.setColor(config.colour)
					.setDescription(i18n.__('settings.server.setup.prompts.timezone.error', config.docs.timezones)),
				// optional: true,
			}
		};

		const enabled = yield { 
			type: 'boolean',
			prompt: {
				start: () => new MessageEmbed()
					.setColor(config.colour)
					.setDescription(i18n.__('settings.server.setup.prompts.enabled.prompt')),
				retry: () => new MessageEmbed()
					.setColor(config.colour)
					.setDescription(i18n.__('settings.server.setup.prompts.enabled.error')),
				// optional: true,
			}
		};

		const channel = yield (
			enabled[0]
				? { 
					type: '_channel',
					prompt: {
						start: () => new MessageEmbed()
							.setColor(config.colour)
							.setDescription(i18n.__('settings.server.setup.prompts.channel.prompt')),
						retry: () => new MessageEmbed()
							.setColor(config.colour)
							.setDescription(i18n.__('settings.server.setup.prompts.channel.error')),
						// optional: true,
					}
				}
				:
				{
					type: 'none'
				}
		);
		return { timezone, enabled, channel };
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
					invalid.push([arg, i18n.__(`settings.options.${arg}.error`) || i18n.__('settings.invalid.option')]);
				continue;
			}

			switch (arg) {
			case 'channel':
				gSettings.set(arg, args[arg].id);
				break;
			case 'enabled':
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
					.setTitle(i18n.__('settings.invalid.title'))
					.setDescription(i18n.__('settings.invalid.description', list))
			);
		}

		let embed = new Embed();

		if (counter === 0)
			embed
				.setTitle(i18n.__('settings.server.set.no_change.title'))
				.setDescription(i18n.__('settings.server.set.no_change.description'));
		else
			embed
				.setTitle(i18n.__('settings.server.set.success.title'))
				.setDescription(i18n.__('settings.server.setup.success',
					gSettings.prefix || this.client.config.prefix,
					this.client.config.docs.commands + '#server-set'
				));
		
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

module.exports = ServerSetupCommand;