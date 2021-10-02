require('dotenv').config();

const { short } = require('leeks.js');
const DTF = require('@eartharoid/dtf');
const dtf = new DTF('en-GB');
const formats = {
	critical: ['🛑', '&0&!4', '&4', '&0&!c'],
	debug: ['🔇', '&0&!1', '&1', '&9'],
	error: ['‼️', '&0&!4', '&4', '&c'],
	info: ['ℹ️', '&0&!3', '&3', '&b'],
	notice: ['📣', '&0&!6', '&6', '&0&!e'],
	success: ['✅', '&0&!2', '&2', '&a'],
	verbose: ['💬', '&0&!f', '&r', '&r'],
	warn: ['⚠️', '&0&!6', '&6', '&e']
};
const Logger = require('leekslazylogger');
const logger_options = {
	namespaces: ['http', 'manager'],
	transports: [
		new Logger.transports.ConsoleTransport({
			format: function (log) {
				const timestamp = dtf.fill('DD/MM/YY HH:mm:ss', log.timestamp);
				const format = formats[log.level.name];
				return short(`&!7&f ${timestamp} &r ${format[1]} ${log.level.name} &r ${log.namespace ? `${format[2]}(${log.namespace})&r ` : ''}${format[0]} ${format[3] + log.content}`);
			},
			level: 'info'
		}),
		new Logger.transports.FileTransport({
			format: function (log) {
				const timestamp = dtf.fill('DD/MM/YY HH:mm:ss', log.timestamp);
				const format = formats[log.level.name];
				return `${timestamp} ${log.level.name} ${log.namespace ? `(${log.namespace}) ` : ''}${`${log.file}:${log.line}:${log.column}`} ${format[0]} ${log.content}`;
			},
			level: 'verbose',
			name: 'Christmas Countdown Bot'
		})
	]
};
const log = new Logger(logger_options);


const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/bot.js');

log.info.manager('shard manager is starting');

manager.on('shardCreate', shard => log.info.manager(`launched shard ${shard.id}`));

manager.spawn().then(shards => {
	log.success.manager(`spawned ${shards.size} shards`);
	logger_options.namespaces = [...logger_options.namespaces, ...shards.map(shard => `shard${shard.id}`)];
	log.options =  logger_options;
	shards.forEach(shard => {
		shard.on('message', message => {
			if (message.level && message.content) {
				log[message.level]['shard' + shard.id](message.content);
			}
		});
	});
});

const fastify = require('fastify')({ ignoreTrailingSlash: true });

fastify.addHook('onResponse', (req, res, done) => {
	const status = (res.statusCode >= 500
		? '&4'
		: res.statusCode >= 400
			? '&6'
			: res.statusCode >= 300
				? '&3'
				: res.statusCode >= 200
					? '&2'
					: '&f') + res.statusCode;
	let response_time = res.getResponseTime().toFixed(2);
	response_time= (response_time >= 20
		? '&c'
		: response_time >= 5
			? '&e'
			: '&a') + response_time + 'ms';
	log.info.http(short(`(${req.raw.httpVersion}) ${req.ip} ${req.method} ${req.routerPath ?? '*'} &m-+>&r ${status}&b in ${response_time}`));
	done();
});

fastify.get('/', async (req, res) => {
	const shards = await manager.fetchClientValues('guilds.cache.size');
	const guilds = shards.reduce((acc, count) => acc + count, 0);
	log.info(`currently in ${guilds} guilds over ${shards.length} shards`);
	res.send({ guilds });
});

fastify.get('/status', async (req, res) => {
	const shards = await manager.fetchClientValues('ws.status');
	res.send({ shards });
});

fastify.get('/status/:shard', async (req, res) => {
	const shards = await manager.fetchClientValues('ws.status');
	const shard = shards[req.params.shard]; // https://discord.js.org/#/docs/main/stable/typedef/Status
	if (shard !== undefined) {
		res
			.code(shard === 0 ? 200 : 503)
			.send({ status: shard });
	} else {
		res
			.code(400)
			.send('Shard does not exist');
	}
});

fastify.listen(process.env.PORT || 80, (error, address) => {
	if (error) log.error(error);
	else log.success.http(`HTTP server listening at ${address}`);
});

process.on('unhandledRejection', error => {
	log.warn('An error was not caught');
	log.error(error);
});

