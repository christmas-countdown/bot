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
			count: 1,
			segmentation: {
				command: command.id,

				shard: this.client.shard.ids[0],

				// guild_id: message.guild?.id,
				guild_premium: gSettings?.premium,
				guild_custom_prefix: gSettings?.prefix !== this.client.config.prefix,
				guild_enabled: gSettings?.enabled,
				guild_timezone: gSettings?.timezone,
				guild_locale: gSettings?.locale,

				// user_id: message.author.id,
				user_timezone: uSettings?.timezone,
				user_locale: uSettings?.locale,
			},
		});
		
	}
}

module.exports = OnCommandStartedListener;