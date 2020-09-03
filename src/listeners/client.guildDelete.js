/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger();

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
			log.info(`${global.prefix} Removed from '${guild.name}' (${client.guilds.cache.size}/${total})`);
		});
		
		let row = await guild.settings();

		row.destroy(); // delete row

	}
}

module.exports = OnGuildDeleteListener;