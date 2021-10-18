const EventListener = require('../modules/listeners/listener');

module.exports = class GuildDeleteEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'guildDelete' });
	}

	async execute(guild) {
		const shards = await this.client.shard.fetchClientValues('guilds.cache.size');
		const guilds = shards.reduce((acc, count) => acc + count, 0);
		this.client.log.info(`Removed from "${guild.name}" (${this.client.guilds.cache.size}/${guilds})`);
		this.client.prisma.guild.delete({ where: { id: guild.id } });
	}
};