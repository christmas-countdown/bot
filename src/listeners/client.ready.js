/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger();
const fetch = require('node-fetch');

class OnReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			type: 'once'
		});
	}

	exec() {
		const { client } = this;
		const { config } = client;

		log.success(`${global.prefix} Ready`);
		if (!client.shard.ids.includes(0)) return; // stop here if not primary shard

		const updatePresence = () => {
			let num = Math.floor(Math.random() * config.presence.activities.length);
			client.user.setPresence({
				activity: {
					name: config.presence.activities[num] + `  |  ${config.prefix}help`,
					type: config.presence.types[num]
				}
			}).catch(log.error);
			log.debug(`${global.prefix} Updated presence: ${config.presence.types[num]} ${config.presence.activities[num]}`);
		};
		
		setInterval(updatePresence, 15000); // every 15 seconds

		log.info(`${global.prefix} Checking database for guilds`);
		client.guilds.cache.each(async guild => {
			if(!await guild.settings()) {	
				client.db.Guild.create(require('../models/guild').defaults(guild));
				log.console(log.f(`${global.prefix} Added '&7${guild.name}&f' to the database`));
			}
		});
		const TopGG = require('dblapi.js');
		const dbl = new TopGG(process.env.TOPGG_KEY, client);

		const postCount = () => {
			client.shard.fetchClientValues('guilds.cache.size').then(total => {
				total = total.reduce((acc, count) => acc + count, 0);
				
				log.notice(`${global.prefix} SENDING FAKE SERVER COUNT!`);
				total = 897;
				// return log.notice(`${global.prefix} SKIPPED SENDING SERVER COUNT!`);

				// top.gg
				dbl.postStats(total, client.shard.ids[0], client.shard.count);

				// discord.boats (because boats.js sucks)
				fetch('https://discord.boats/api/bot/' + client.user.id, {
					method: 'POST',
					body:    JSON.stringify({
						server_count: total
					}),
					headers: {
						'Content-Type': 'application/json',
						'Authorization': process.env.BOATS_KEY
					},
				});

				log.info(`${global.prefix} Posted server count`);
			});
		};
		postCount();
		setInterval(postCount, 15 * 60000); // every 15 minutes
	}
}

module.exports = OnReadyListener;