require('dotenv').config();
const ms = require('ms');

const Logger = require('leekslazylogger');
const logger_options = require('./logger/options');
const log = new Logger(logger_options);

log.info.manager('Shard manager is starting');

let sent = 0;

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/bot.js');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Statcord = require('statcord.js');
const statcord = new Statcord.ShardingClient({
	key: process.env.STATCORD,
	manager
});

manager.on('shardCreate', shard => {
	log.info.manager(`Launched shard ${shard.id}`);
	logger_options.namespaces = [...logger_options.namespaces, `shard${shard.id}`];
	log.options = logger_options;
	shard.on('message', message => {
		if (message.level && message.content) {
			log[message.level]['shard' + shard.id](message.content);
		}
	});
});

manager.spawn().then(async shards => {
	// logging
	log.success.manager(`Spawned ${shards.size} shards`);

	// api
	require('./api')(manager, prisma, log);

	// countdown message dispatcher
	const dispatcher = require('./dispatcher');
	sent += await dispatcher.dispatch(manager, prisma, log);
	setInterval(async () => {
		sent += await dispatcher.dispatch(manager, prisma, log);
	}, ms('1h'));

	// santa tracker
	const tracker = require('./santa-tracker');
	setInterval(() => tracker.track(manager, prisma, log), ms('2.5m'));

	// server count posting
	if (process.env.NODE_ENV === 'production') {
		const botlists = require('blapi');
		manager.fetchClientValues('user.id', 0).then(id => {
			botlists.setLogging({
				extended: false,
				logger: {
					error: log.error.manager,
					info: log.info.manager,
					warn: log.warn.manager
				}
			});
			const keys = {
				'botlist.space': process.env.BL_SPACE,
				'botsfordiscord.com': process.env.BL_BFD,
				'discord.bots.gg': process.env.BL_DBGG,
				'discordapps.dev': process.env.BL_DADEV,
				'discordbotlist.com': process.env.BL_DBL,
				'discordservices.net': process.env.BL_DS,
				'top.gg': process.env.BL_TOPGG,
				'voidbots.net': process.env.BL_VOID
			};
			const post = async () => {
				const shards = await manager.fetchClientValues('guilds.cache.size');
				const guilds = shards.reduce((acc, count) => acc + count, 0);
				botlists.manualPost(guilds, id, keys, 0, manager.shards.size, shards)
					.then(() => log.success.manager(`Posted server count (${guilds} over ${shards.length} shards)`))
					.catch(error => log.error.manager(error));
			};
			setInterval(post, ms('15m'));
		});
	}
});

statcord.registerCustomFieldHandler(1, async () => String(await prisma.guild.count({ where: { enabled: true } })));
statcord.registerCustomFieldHandler(2, () => {
	const count = String(sent);
	sent = 0;
	return count;
});

statcord.on('autopost-start', () => {
	log.info.manager('Automatic stats posting enabled');
});

statcord.on('post', error => {
	if (error) log.error.manager(error);
	else log.verbose.manager('Posted stats');
});

process.on('unhandledRejection', error => {
	log.notice.manager('An error was not caught');
	log.error.manager(error);
});

/** FOR JSDOC TYPES, NOT FOR IMPORTING */
module.exports = {
	log,
	manager,
	prisma
};