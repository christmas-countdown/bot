const EventListener = require('../modules/listeners/listener');

module.exports = class GuildCreateEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'guildCreate' });
	}

	async execute(guild) {
		const shards = await this.client.shard.fetchClientValues('guilds.cache.size');
		const guilds = shards.reduce((acc, count) => acc + count, 0);
		this.client.log.info(`Added to "${guild.name}" (${this.client.guilds.cache.size}/${guilds})`);
		this.client.prisma.guild.create({
			data: {
				id: guild.id,
				locale: this.client.i18n.locales.find(l => l === guild.preferredLocale || l.split('-')[0] === guild.preferredLocale) ?? 'en-GB'
			}
		});
	}
};