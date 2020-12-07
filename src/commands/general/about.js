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
		let isDefault = prefix === this.client.config.prefix ? ` ${i18n.__('general.about.fields.prefix.default')}` : '';
		
		let arr = await this.client.shard.fetchClientValues('guilds.cache.size');
		if (arr.length !== this.client.shard.count) return;
		let server_count = arr.reduce((acc, num) => acc + num, 0);
		
		return message.util.send(
			new Embed()
				.setTitle(i18n.__('general.about.title'))
				.setDescription(i18n.__('general.about.description', 'https://eartharoid.me'))
				.addField(i18n.__('general.about.fields.prefix.title'), `\`${prefix}\`${isDefault}`, true)
				.addField(i18n.__('general.about.fields.website'), `[${this.client.config.website.pretty}](${this.client.config.website.url})`, false)
				.addField(i18n.__('general.about.fields.docs'), `[${this.client.config.docs.pretty}](${this.client.config.docs.main})`, false)
				.addField(i18n.__('general.about.fields.support'), `[${this.client.config.support.invite}](${this.client.config.support.url})`, false)
				// .addField(i18n.__('general.about.fields.guilds'), await this.client.db.Guild.count(), true)
				.addField(i18n.__('general.about.fields.guilds'), server_count, true)
				.addField(i18n.__('general.about.fields.premium_guilds'), await this.client.db.Guild.count({
					where: {
						premium: true
					}
				}), true)
				.addField(i18n.__('general.about.fields.enabled_guilds.title'), i18n.__('general.about.fields.enabled_guilds.servers', await this.client.db.Guild.count({
					where: {
						enabled: true
					}
				})), true)
		);
	}
}

module.exports = InfoCommand;