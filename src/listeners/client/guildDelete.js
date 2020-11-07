/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');


class OnGuildDeleteListener extends Listener {
	constructor() {
		super('guildDelete', {
			emitter: 'client',
			event: 'guildDelete'
		});
	}

	async exec(guild) {
		const { client } = this;

		client.shard.fetchClientValues('guilds.cache.size').then(total => {
			total = total.reduce((acc, count) => acc + count, 0);
			this.client.log.info(`Removed from '${guild.name}' (${client.guilds.cache.size}/${total})`);
		});
		
		let row = await guild.settings();

		if (!row.premium)
			row.destroy(); // delete row if not premium guild

	}
}

module.exports = OnGuildDeleteListener;