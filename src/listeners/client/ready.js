/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');

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

		this.client.log.success('Ready');
		

		const updatePresence = () => {
			let num = Math.floor(Math.random() * config.presence.activities.length);
			client.user.setPresence({
				activity: {
					name: config.presence.activities[num] + `  |  ${config.prefix}help`,
					type: config.presence.types[num]
				}
			}).catch(this.client.log.error);
			this.client.log.debug(`Updated presence: ${config.presence.types[num]} ${config.presence.activities[num]}`);
		};
		updatePresence();
		setInterval(updatePresence, 15000); // every 15 seconds

		this.client.log.info('Checking database for guilds');
		client.guilds.cache.each(async guild => {
			if(!await guild.settings()) {	
				client.db.Guild.create(require('../models/guild').defaults(guild));
				this.client.log.console(this.client.log.f(`Added '&7${guild.name}&f' to the database`));
			}
		});


		
		// stop here if not primary shard
		if (!client.shard.ids.includes(0)) return; 

		const TopGG = require('dblapi.js');
		const dbl = new TopGG(process.env.TOPGG_KEY, client);

		const postCount = () => {
			client.shard.fetchClientValues('guilds.cache.size').then(total => {
				total = total.reduce((acc, count) => acc + count, 0);
				
				this.client.log.notice('WARNING');
				total = 897;
				this.client.log.notice('SENDING FAKE SERVER COUNT!');

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

				this.client.log.info('Posted server count');
			});
		};
		postCount();
		setInterval(postCount, 15 * 60000); // every 15 minutes
	}
}

module.exports = OnReadyListener;