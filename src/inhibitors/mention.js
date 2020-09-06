/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Inhibitor } = require('discord-akairo');
const { Embed } = require('../bot');

const { I18n } = require('i18n');
const i18n = new I18n(require('../bot').i18n);

class MentionInhibitor extends Inhibitor {
	constructor() {
		super('mention', {
			reason: 'mention',
			type: 'all'
		});
	}

	async exec(message) {

		let settings = await message.guild.settings();
		i18n.setLocale(settings.locale || 'en-GB');
		const prefix = settings.prefix || this.client.config.prefix;

		if (message.mentions.has(this.client.user) && !message.content.trim().match(/[a-zA-Z]/gm)) {
			// mention with no command
			message.channel.send(message.author,
				new Embed()
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(i18n.__('Hello!'))
					.setDescription(i18n.__(''))
					.addField(i18n.__('Server prefix'), `\`${prefix}\` ${prefix === this.client.config.prefix ? '(default)': ''}`)
			);
			return true; // stop command execution
		} else {
			return false; // otherwise, continue
		}
	}
}

module.exports = MentionInhibitor;