require('dotenv').config();

const Logger = require('leekslazylogger');
const logger_options = require('./logger/options');
const log = new Logger(logger_options);

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/bot.js');

log.info.manager('Shard manager is starting');

manager.on('shardCreate', shard => log.info.manager(`Launched shard ${shard.id}`));

manager.spawn().then(shards => {
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
});

require('./api')(manager, log);

process.on('unhandledRejection', error => {
	log.warn('An error was not caught');
	log.error(error);
});
