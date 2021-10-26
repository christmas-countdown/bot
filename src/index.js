require('dotenv').config();
const ms = require('ms');

const Logger = require('leekslazylogger');
const logger_options = require('./logger/options');
const log = new Logger(logger_options);

log.info.manager('Shard manager is starting');

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/bot.js');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Statcord = require('statcord.js');
const statcord = new Statcord.ShardingClient({
	key: process.env.STATCORD,
	manager
});

manager.on('shardCreate', shard => log.info.manager(`Launched shard ${shard.id}`));

manager.spawn().then(shards => {
	// logging
	log.success.manager(`Spawned ${shards.size} shards`);
	logger_options.namespaces = [...logger_options.namespaces, ...shards.map(shard => `shard${shard.id}`)];
	log.options = logger_options;
	shards.forEach(shard => {
		shard.on('message', message => {
			if (message.level && message.content) {
				log[message.level]['shard' + shard.id](message.content);
			}
		});
	});

	// api
	require('./api')(manager, prisma, log);

	// countdown message dispatcher
	const dispatcher = require('./dispatcher');
	dispatcher.dispatch(manager, prisma, log);
	setInterval(() => dispatcher.dispatch(manager, prisma, log), ms('1h'));

	// server count posting
	if (process.env.NODE_ENV === 'production') {
		const botlists = require('blapi');
		manager.fetchClientValues('user.id', 0).then(id => {
			botlists.setLogging({
				extended: false,
				logger: log
			});
			const keys = {
				'botlist.space': process.env.BL_SPACE,
				'botsfordiscord.com': process.env.BL_BFD,
				'discord.boats': process.env.BL_BOATS,
				'discord.bots.gg': process.env.BL_DBGG,
				'discordapps.dev': process.env.BL_DADEV,
				'discordbotlist.com': process.env.BL_DBL,
				'top.gg': process.env.BL_TOPGG
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

statcord.on('autopost-start', () => {
	log.info.manager('Automatic stats posting enabled');
});

statcord.on('post', error => {
	if (error) log.error.manager(error);
	else log.verbose.manager('Posted stats');
});

process.on('unhandledRejection', error => {
	log.warn('An error was not caught');
	log.error(error);
});

/** FOR JSDOC TYPES, NOT FOR IMPORTING */
module.exports = {
	log,
	manager,
	prisma
};