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

	async check() {
		this.client.log.info('Checking Secret Santa events');
		for (const [, guild] of this.client.guilds.cache) guild.scheduledEvents.cache.forEach(event => this.handleEvent(event));
	}

	/**
	 * @param {import('discord.js').GuildScheduledEvent} event
	 * @returns {Promise<void>}
	 */
	async handleEvent(event) {
		if (event.entityMetadata?.location?.toLowerCase() !== 'christmas countdown') return false; // ignore unrelated events

		let row = await this.client.prisma.secretSanta.findUnique({
			include: { guild: true },
			where: { id: event.id }
		});

		if (!row) {
			this.client.log.info(`New Secret Santa event in "${event.guild.name}"`);
			row = await this.client.prisma.secretSanta.create({
				data: {
					date: event.scheduledStartAt,
					guild_id: event.guild.id,
					id: event.id,
					status: event.status
				}
			});
		}

		if (event.isActive() && Object.keys(row.users).length === 0) { // ACTIVE and not already assigned
			this.client.log.info(`Secret Santa event active in "${event.guild.name}"`);
			const interested = (await event.fetchSubscribers())
				.map(i => i.user.id)
				.filter(id => !row.guild.secret_santa_blacklist.includes(id));
			if (interested.length < 3) return this.client.log.info(`Secret Santa event in "${event.guild.name}" does not have enough users`);
			const users = this.assignUsers(interested);
			row = await this.client.prisma.secretSanta.update({
				data: {
					status: event.status,
					users
				},
				where: { id: event.id }
			});
		} else if (event.isScheduled()) {
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