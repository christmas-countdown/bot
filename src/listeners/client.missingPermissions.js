/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { I18n } = require('i18n');
const i18n = new I18n(require('../bot').i18n);

class OnMissingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			emitter: 'client',
			event: 'missingPermissions'
		});
	}

	async exec(message, command, type, missing) {

		i18n.setLocale((await message.guild.settings()).locale || 'en-GB');

		let cmd = this.client.config.prefix + command.id;
		if (type === 'client') {
			// ❯ return a promise
			return message.util.send(
				new MessageEmbed()
					.setColor(this.client.config.colour)
					.setTitle(i18n.__('Missing permissions'))
					.setDescription(i18n.__(`To execute the \`%s\` command, the bot requires the following missing permissions: 
\`%s\``), cmd, missing)
					.addField(i18n.__('Required permissions'), command.clientPermissions)
					.setFooter(i18n.__(this.client.const.footer), this.client.user.displayAvatarURL())
			);
		} else {
			// user
			// ❯ return a promise
			return message.util.send(
				new MessageEmbed()
					.setColor(this.client.config.colour)
					.setTitle(i18n.__('Missing permissions'))
					.setDescription(i18n.__(`You must have following missing permissions to use the \`%s\` command: 
\`%s\``), cmd, missing)
					.addField(i18n.__('Required permissions'), command.userPermissions)
					.setFooter(i18n.__(this.client.const.footer), this.client.user.displayAvatarURL())
			);
		}
	}
}

module.exports = OnMissingPermissionsListener;