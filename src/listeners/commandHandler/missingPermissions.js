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

class OnMissingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions'
		});
	}

	async exec(message, command, type, missing) {

		if(!message.guild.me.permissionsIn(message.channel).has('SEND_MESSAGES'))
			return;

		let settings = await message.guild.settings();
		i18n.setLocale(settings.locale || 'en-GB');
		let cmd = command.id; // this.client.config.prefix + 

		

		if (type === 'client') {
			// BOT
			let text = i18n.__('The bot is missing the following permissions: \n`%s`', missing.join(', '));	

			if(message.guild.me.permissionsIn(message.channel).has('EMBED_LINKS')) 
				return message.util.send(
					new Embed()
						.setTitle(i18n.__('Missing permissions'))
						.setDescription(text)
				);
			else
				return message.util.send(text);

		} else {
			// MEMBER
			let text = i18n.__('You must have following permissions to use the `%s` command: \n`%s`.', cmd, command.userPermissions.join(', '));	

			if(message.guild.me.permissionsIn(message.channel).has('EMBED_LINKS')) 
				return message.util.send(
					new Embed()
						.setTitle(i18n.__('Missing permissions'))
						.setDescription(text)
				);
			else
				return message.util.send(text);

		}
	}
}

module.exports = OnMissingPermissionsListener;