/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');

const { Embed } = require('../../bot');

const I18n = require('../../locales');

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
	
		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		const prefix = gSettings?.prefix || this.client.config.prefix;
	
		let embed = new Embed()
		// .setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle(i18n.__('message_invalid.title'))
			.addField(i18n.__('message_invalid.fields.help.title'), i18n.__('message_invalid.fields.help.text', `${prefix}help`, `${this.client.user.toString()} help`));
		
		if (message.guild)
			embed.addField(i18n.__('message_invalid.fields.prefix.title'), `\`${prefix}\` ${prefix === this.client.config.prefix ? i18n.__('message_invalid.fields.prefix.default') : ''}`);
		
		embed.addField(i18n.__('message_invalid.fields.support'), `[${this.client.config.support.invite}](${this.client.config.support.url})`);

		return message.util.send(message.author, embed);
		
	}
}

module.exports = OnMessageInvalidListener;