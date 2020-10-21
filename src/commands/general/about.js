/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

class InfoCommand extends Command {
	constructor() {
		super('info', {
			aliases: ['info', 'about'],
			description: {
				content: 'Show information about the bot',
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	async exec(message) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		const prefix = gSettings?.prefix || this.client.config.prefix;
		
		return message.util.send(
			new Embed()
				.setTitle(i18n.__('Information'))
				.setDescription(i18n.__('A Discord bot made by %s.', '[eartharoid](https://eartharoid.me)'))
				.addField(i18n.__('Server prefix'), `\`${prefix}\` ${prefix === this.client.config.prefix ? '(default)': ''}`, true)
				.addField(i18n.__('Website'), `[${this.client.config.website.pretty}](${this.client.config.website.url})`, false)
				.addField(i18n.__('Documentation'), `[${this.client.config.docs.pretty}](${this.client.config.docs.main})`, false)
				.addField(i18n.__('Support server'), `[${this.client.config.support.invite}](${this.client.config.support.url})`, false)
				.addField(i18n.__('Guilds'), await this.client.db.Guild.count(), true)
				.addField(i18n.__(':star: Premium guilds'), await this.client.db.Guild.count({
					where: {
						premium: true
					}
				}), true)
				.addField(i18n.__('Counting down in'), i18n.__('%d servers', await this.client.db.Guild.count({
					where: {
						enabled: true
					}
				})), true)
		);
	}
}

module.exports = InfoCommand;