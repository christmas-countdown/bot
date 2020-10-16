/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');

const fetch = require('node-fetch');
const countdown = require('../../modules/countdown');
class OnReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			type: 'once'
		});
	}

	exec() {

		this.client.log.success('Ready');

		setInterval(() => {
			countdown.run(this.client);
		}, 600000); // once per hour
		
		const updatePresence = () => {
			let presence = this.client.config.presences[Math.floor(Math.random() * this.client.config.presences.length)];
			this.client.user.setPresence({
				activity: {
					name: `${presence.activity}  |  ${this.client.config.prefix}help`,
					type: presence.type
				}
			}).catch(this.client.log.error);
			this.client.log.debug(`Updated presence: ${presence.activity} ${presence.type}`);
		};

		setInterval(updatePresence, 60000); // every minute
		
		// stop here if not primary shard
		if (!this.client.shard.ids.includes(0)) return; 

		const TopGG = require('dblapi.js');
		const dbl = new TopGG(process.env.TOPGG_KEY, this.client);

		const postCount = () => {
			this.client.shard.fetchClientValues('guilds.cache.size').then(total => {
				total = total.reduce((acc, count) => acc + count, 0);

				/** FAKE SERVER COUNT FOR DEV ONLY */
				if (total < 100) {
					total = 871;	
					this.client.log.notice('WARNING: SENDING FAKE SERVER COUNT');
				}

				// top.gg
				dbl.postStats(total, this.client.shard.ids[0], this.client.shard.count);

				// discord.boats (boats.js sucks)
				fetch('https://discord.boats/api/bot/' + this.client.user.id, {
					method: 'POST',
					body: JSON.stringify({
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