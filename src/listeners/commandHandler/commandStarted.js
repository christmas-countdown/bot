/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');

class OnCommandStartedListener extends Listener {
	constructor() {
		super('commandStarted', {
			emitter: 'commandHandler',
			event: 'commandStarted'
		});
	}

	async exec(message, command) {
		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();

		
		this.client.log.console(
			this.client.log.f(`&7${message.author.tag}&f used the &e${command.id}&f command`));

		this.client.Countly.add_log(`${message.author.tag} used the ${command.id} command`);

		this.client.Countly.add_event({
			key: 'discord_command_used',
			command: command.id,

			guild: message.guild ? {
				premium: gSettings?.premium,
				enabled: gSettings?.enabled,
				timezone: gSettings?.timezone,
				locale: gSettings?.locale,
			} : null,
			user: {
				timezone: uSettings?.timezone,
				locale: uSettings?.locale,
			}
		});
		
	}
}

module.exports = OnCommandStartedListener;