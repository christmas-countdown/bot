/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');

const { Embed, i18n: i18nOptions } = require('../../bot');

const { I18n } = require('i18n');
const i18n = new I18n(i18nOptions);

class OnMessageInvalidListener extends Listener {
	constructor() {
		super('messageInvalid', {
			emitter: 'commandHandler',
			event: 'messageInvalid'
		});
	}

	async exec(message) {
		
		if (!message.mentions.has(this.client.user))
			return;

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
	
		i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');

		const prefix = gSettings?.prefix || this.client.config.prefix;
	
		let embed = new Embed()
		// .setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle(i18n.__('Hello!'))
			.setDescription(i18n.__(''))
			.addField(i18n.__('Help'), i18n.__('`%s` or "%s"', `${prefix}help`, `${this.client.user.toString()} help`));
		
		if (message.guild)
			embed.addField(i18n.__('Server prefix'), `\`${prefix}\` ${prefix === this.client.config.prefix ? '(default)': ''}`);
		
		embed.addField(i18n.__('Support server'), `[${this.client.config.support.invite}](${this.client.config.support.url})`);

		message.util.send(message.author,
			embed
		);
		
	}
}

module.exports = OnMessageInvalidListener;