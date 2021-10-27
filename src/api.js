const { short } = require('leeks.js');

/**
 * @param {import('./').manager} manager
 * @param {import('./').prisma} prisma
 * @param {import('./').log} log
 */
module.exports = (manager, prisma, log) => {
	const fastify = require('fastify')({ ignoreTrailingSlash: true });
	fastify.addHook('onResponse', (req, res, done) => {
		done();
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
		response_time = (response_time >= 20
			? '&c'
			: response_time >= 5
				? '&e'
				: '&a') + response_time + 'ms';
		log.verbose.http(short(`(${req.raw.httpVersion}) ${req.ip} ${req.method} ${req.routerPath ?? '*'} &m-+>&r ${status}&b in ${response_time}`));
	});

	fastify.get('/metrics', async (req, res) => {
		res.send('soon');
	});

	fastify.get('/stats', async (req, res) => {
		const reducer = (stats, value) => {
			if (value.locale !== null) {
				if (!stats.locales[value.locale]) stats.locales[value.locale] = 0;
				stats.locales[value.locale] += 1;
			}

			if (value.timezone !== null) {
				if (!stats.timezones[value.timezone]) stats.timezones[value.timezone] = 0;
				stats.timezones[value.timezone] += 1;
			}

			return stats;
		};

		const guilds = await prisma.guild.findMany();
		const guild_stats = guilds.reduce(reducer, {
			locales: {},
			timezones: {}
		});

		const users = await prisma.user.findMany();
		const user_stats = users.reduce(reducer, {
			locales: {},
			timezones: {}
		});

		const sorter = (a, b) => b.count - a.count;

		res.send({
			guild_locales: Object.keys(guild_stats.locales).map(locale => ({
				count: guild_stats.locales[locale],
				name: locale
			})).sort(sorter),
			guild_timezones: Object.keys(guild_stats.timezones).map(timezone => ({
				count: guild_stats.timezones[timezone],
				name: timezone
			})).sort(sorter),
			user_locales: Object.keys(user_stats.locales).map(locale => ({
				count: user_stats.locales[locale],
				name: locale
			})).sort(sorter),
			user_timezones: Object.keys(user_stats.timezones).map(timezone => ({
				count: user_stats.timezones[timezone],
				name: timezone
			})).sort(sorter)
		});
	});

	fastify.get('/guilds', async (req, res) => {
		const shards = await manager.fetchClientValues('guilds.cache.size');
		const guilds = shards.reduce((acc, count) => acc + count, 0);
		log.info(`Currently in ${guilds} guilds over ${shards.length} shards`);
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
				.send(shard);
		} else {
			res
				.code(400)
				.send('Shard does not exist');
		}
	});

	fastify.listen(process.env.PORT || 80, '0.0.0.0', (error, address) => {
		if (error) log.error(error);
		else log.success.http(`HTTP server listening at ${address}`);
	});
};