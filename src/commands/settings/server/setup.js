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
					.setDescription(i18n.__('**Which timezone do you want the bot to use?**\n\n[Click here for a list of timezones](%s).\nIf you don\'t know, choose `UTC` now, __you can change this later__.',
						config.docs.timezones
					)),
				retry: () => new MessageEmbed()
					.setColor(config.colour)
					.setDescription(i18n.__('Invalid timezone. See the [docs](%s). Exited prompt.', config.docs.timezones)),
				// optional: true,
			}
		};

		const enabled = yield { 
			type: 'boolean',
			prompt: {
				start: () => new MessageEmbed()
					.setColor(config.colour)
					.setDescription(i18n.__('**Enable the countdown?** (`yes`/`no`)\n__You can change this later__.')),
				retry: () => new MessageEmbed()
					.setColor(config.colour)
					.setDescription(i18n.__('Invalid input. Exited prompt.')),
				// optional: true,
			}
		};

		const channel = yield (
			enabled[0]
				? { 
					type: 'channelMention',
					prompt: {
						start: () => new MessageEmbed()
							.setColor(config.colour)
							.setDescription(i18n.__('Mention the text channel you want the countdown to use.')),
						retry: () => new MessageEmbed()
							.setColor(config.colour)
							.setDescription(i18n.__('Invalid channel mention. Exited prompt.')),
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
					invalid.push([arg, this.client.config.options[arg]?.error || 'Invalid input (see docs)']);
				continue;
			}
	
			gSettings.set(arg, args[arg]);

			counter++;
		}

		gSettings.save(); // update database

		if (invalid.length > 0) {
			let docs = this.client.config.docs.settings;
			let list = '';

			for (let i in invalid)
				list += `❯ [\`${invalid[i][0]}\`](${docs}/server#${invalid[i][0]}) » ${i18n.__(invalid[i][1])}\n`;

			return message.util.send(
				new Embed()
					.setTitle(':x: Server settings')
					.setDescription(i18n.__('There were some issues with the provided options:\n%s\n**Click on the blue setting name to see the documentation.**',
						list
					))
			);
		}

		const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
		let embed = new Embed();

		if (counter === 0)
			embed
				.setTitle(i18n.__('Server settings'))
				.setDescription(i18n.__('Nothing changed.'));
		else
			embed
				.setTitle(i18n.__(':white_check_mark: Server settings updated'))
				.setDescription(i18n.__('You can further modify your settings with [`%sserver set`](%s).',
					gSettings.prefix || this.client.config.prefix,
					this.client.config.docs.commands + '#server-set'
				));
		
		for (let arg in args)
			if (arg === 'channel')
				embed.addField(i18n.__(capitalise(arg)), gSettings.get(arg) !== null ? `<#${gSettings.get(arg)}>` : i18n.__('none'), true);
			else if (arg === 'role')
				embed.addField(i18n.__(capitalise(arg)), gSettings.get(arg) !== null ? `<@&${gSettings.get(arg)}>` : i18n.__('none'), true);
			else 
				embed.addField(i18n.__(capitalise(arg)), gSettings.get(arg) !== null ? `\`${gSettings.get(arg)}\`` : i18n.__('none'), true);

		return message.util.send(embed);

	}
}

module.exports = ServerSetupCommand;