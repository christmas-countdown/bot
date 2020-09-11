/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const config = require('../../../../config');

const { I18n } = require('i18n');
const i18n = new I18n(require('../../../bot').i18n);


const lang = async (msg) => {
	let uSettings = await msg.author.settings(),
		gSettings = await msg.guild.settings();
	i18n.setLocale(uSettings?.locale || gSettings.locale || 'en-GB');
};
class ServerSetupCommand extends Command {
	constructor() {
		super('server-setup', {
			aliases: ['server-setup'],
			description: 'Configure the bot\'s server settings using the setup prompt',
			channel: 'guild', // guilds only
			userPermissions: ['MANAGE_GUILD'], // only server admins
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					id: 'timezone',
					match: 'option',
					flag: 'timezone:',
					type: 'timezone', // custom
					prompt: {
						start: m => {
							lang(m); // first one needs to set the locale
							return new MessageEmbed()
								.setColor(config.colour)
								.setDescription(i18n.__('Which timezone do you want the bot to use?'));
						},
						retry: () => new MessageEmbed()
							.setColor(config.colour)
							.setDescription(i18n.__('Invalid timezone. See the [docs](%s).', config.docs.timezones))
					}
				},
				{
					id: 'channel',
					match: 'option',
					flag: 'channel:',
					type: 'channelMention', // textChannel
					prompt: {
						start: () => new MessageEmbed()
							.setColor(config.colour)
							.setDescription(i18n.__('Mention the text channel you want the countdown to use.')),
						retry: () => new MessageEmbed()
							.setColor(config.colour)
							.setDescription(i18n.__('Invalid channel mention.'))
					}
				},
				{
					id: 'enabled',
					match: 'option',
					flag: 'enabled:',
					type: 'boolean',
					prompt: {
						start: () => new MessageEmbed()
							.setColor(config.colour)
							.setDescription(i18n.__('Enable the countdown? (yes/no)')),
						retry: () => new MessageEmbed()
							.setColor(config.colour)
							.setDescription(i18n.__('Invalid input.'))
					}
				},
			],
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