const ms = require('ms');

module.exports = class SecretSanta {
	/**
	 * @param {import('./bot')} client
	 */
	constructor(client) {
		this.client = client;
	}

	assignUsers(users) {
		const shuffled = this.shuffle(users);
		const assigned = {};
		for (let i = 0; i <= shuffled.length - 1; i++) assigned[shuffled[i]] = i === shuffled.length - 1 ? shuffled[0] : shuffled[i + 1]; // shift
		return assigned;
	}

	check() {
		this.client.guilds.cache.forEach(async guild => {
			// GET /guilds/{guild.id}/scheduled-events
			const events = await this.client.api.guilds(guild.id)['scheduled-events'].get();
			events.forEach(async event => await this.handleEvent(event));
		});
	}

	async handleEvent(event) {
		if (event.entity_metadata?.location?.toLowerCase() !== 'christmas countdown') return false; // ignore unrelated events

		const guild_name = this.client.guilds.cache.get(event.guild_id)?.name;
		const g_settings = await this.client.prisma.guild.findUnique({ where: { id: event.guild_id } });
		let row = await this.client.prisma.secretSanta.findUnique({ where: { id: event.id } });

		if (!row) {
			this.client.log.info(`New Secret Santa event in "${guild_name}"`);
			row = await this.client.prisma.secretSanta.create({
				data: {
					date: new Date(event.scheduled_start_time),
					guild_id: event.guild_id,
					id: event.id,
					status: event.status
				}
			});
		}

		if (event.status === 2 && Object.keys(row.users).length === 0) { // ACTIVE and not already assigned
			this.client.log.info(`Secret Santa event active in "${guild_name}"`);

			// GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}
			event = await this.client.api.guilds(event.guild_id)['scheduled-events'](event.id).get({ query: { with_user_count: true } });

			if (event.user_count < 3) return this.client.log.info(`Secret Santa event in "${guild_name}" does not have enough users`);

			let interested = [];
			let total = 0;

			for (let i = 1; i <= Math.ceil(event.user_count / 100); i++) {
				// GET /guilds/{guild.id}/scheduled-events/{guild_scheduled_event.id}/users
				const part = await this.client.api.guilds(event.guild_id)['scheduled-events'](event.id).users.get({
					query: {
						after: total,
						limit: 100
					}
				});
				interested = [...interested, ...part];
				total += 100;
			}

			// map user IDs and filter through blacklist
			interested = interested
				.map(i => i.user.id)
				.filter(id => !g_settings.secret_santa_blacklist.includes(id));

			const users = this.assignUsers(interested);

			row = await this.client.prisma.secretSanta.update({
				data: {
					status: event.status,
					users
				},
				where: { id: event.id }
			});
		} else if (event.status !== 1) { // COMPLETE or CANCELLED
			row = await this.client.prisma.secretSanta.update({
				data: { status: event.status },
				where: { id: event.id }
			});
		}
	}

	shuffle(array) {
		let i = array.length;
		let r;

		while (i !== 0) {
			r = Math.floor(Math.random() * i);
			i--;
			[array[i], array[r]] = [array[r], array[i]];
		}

		return array;
	}

	startAutoCheck() {
		this.check();
		this.interval = setInterval(() => {
			this.check();
		}, ms('12h'));
	}
};