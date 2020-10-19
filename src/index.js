/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

require('dotenv').config();
const config = require('../config');

const Logger = require('leekslazylogger');
const log = new Logger({
	name: 'Christmas Countdown Bot',
	debug: config.debug,
	logToFile: false, // enabling here won't enable it for actual bot shards
	keepSilent: true,
});

log.info('Christmas Countdown Bot is starting', ['magenta']);

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('src/bot.js', { respawn: config.respawn });

log.info('[MANAGER] Shard manager started');

manager.on('shardCreate', shard => log.info(`[MANAGER] Launched shard ${shard.id}`));

manager.on('message', (shard, message) => {
	log.debug(`[MANAGER] Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

manager.spawn();

process.on('unhandledRejection', error => {
	log.warn('[MANAGER] An error was not caught');
	log.error(error);
});
