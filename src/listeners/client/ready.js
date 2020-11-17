/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Listener } = require('discord-akairo');

const botlists = require('blapi');
const Countdown = require('../../modules/countdown');
const utils = require('../../modules/utils');
class OnReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			type: 'once'
		});
	}

	async exec() {

		this.client.log.success('Ready');

		this.client.log.info('Checking database for guilds');
		this.client.guilds.cache.forEach(async guild => {
			if (!await guild.settings()) {
				this.client.db.Guild.create(require('../../models/guild').defaults(guild));
				this.client.log.console(this.client.log.f(`Added '&7${guild.name}&f' to the database`));
			}
		});

		await utils.wait(1000); // wait a seconds to ensure all guilds are in the database first
		Countdown.run(this.client);
		setInterval(() => {
			Countdown.run(this.client);
		}, 60 * 60000); // once per hour
		
		setInterval(() => {
			let presence = this.client.config.presences[Math.floor(Math.random() * this.client.config.presences.length)];
			this.client.user.setPresence({
				activity: {
					name: `${presence.activity}  |  ${this.client.config.prefix}help`,
					type: presence.type
				}
			}).catch(this.client.log.error);
			this.client.log.debug(`Updated presence: ${presence.activity} ${presence.type}`);
		}, 60000); // every minute
		

		if (process.env.DEVELOPMENT || !this.client.shard.ids.includes(0)) return;
		botlists.setLogging(false);

		const postCount = () => {
			this.client.shard.fetchClientValues('guilds.cache.size').then(arr => {
				if (arr.length !== this.client.shard.count) return;
				let total = arr.reduce((acc, num) => acc + num, 0);

				botlists.manualPost(
					total, // server_count
					this.client.user.id, // bot_id
					{
						'top.gg': process.env.BL_TOPGG,
						'discord.boats': process.env.BL_BOATS,
						'botsfordiscord.com': process.env.BL_BFD,
						'botlist.space': process.env.BL_SPACE,
						'discord.bots.gg': process.env.BL_DBGG,
						'discordapps.dev': process.env.BL_DADEV,
						'discordbotlist.com': process.env.BL_DBL,
					},
					this.client.shard.ids[0], // shard_id
					this.client.shard.count, // shard_count
					arr // shards
				).then(() => {
					this.client.log.info(`Posted server count (${total} over ${this.client.shard.count} shards)`);
				}).catch(e => {
					this.client.log.warn(`Error posting server count: \n${e}`);
				});
				
			});
		};

		postCount();
		setInterval(postCount, 30 * 60000); // every 30 minutes
	}
}

module.exports = OnReadyListener;