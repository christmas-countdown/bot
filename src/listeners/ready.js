const EventListener = require('../modules/listeners/listener');
const { presences } = require('../../config');
const ms = require('ms');
const christmas = require('@eartharoid/christmas');

module.exports = class ReadyEventListener extends EventListener {
	constructor(client) {
		super(client, {
			event: 'ready',
			once: true
		});
	}

	async execute() {
		this.client.log.success(`Connected to Discord as "${this.client.user.tag}"`);

		this.client.commands.load();
		this.client.autocomplete.load();
		this.client.secret_santa.startAutoCheck();

		setInterval(() => {
			this.client.log.debug('updating bot user presence');
			this.client.user.setPresence({ activities: [presences[Math.floor(Math.random() * presences.length)]] });
		}, ms('30s'));

		const updateWidgets = async () => {
			let tried = 0,
				succeeded = 0,
				failed = 0;
			const guilds = await this.client.prisma.guild.findMany({ where: { voice_channel: { not: null } } });
			for (let guild of guilds) {
				if (!this.client.guilds.cache.has(guild.id)) continue; // skip guilds on other shards
				const i18n = this.client.i18n.getLocale(guild.locale ?? 'en-GB');
				const sleeps = christmas.getSleeps(guild.timezone);
				const hours = christmas.getHours(guild.timezone);
				const name = christmas.isToday(guild.timezone)
					? i18n('widget.christmas_day')
					: christmas.isTomorrow()
						? i18n('widget.christmas_eve', hours, { hours })
						: i18n('widget.normal', { sleeps });
				try {
					const channel = this.client.channels.cache.get(guild.voice_channel) || await this.client.channels.fetch(guild.voice_channel);
					if (!channel) throw new Error('Unknown Channel');
					await channel.setName(name);
					this.client.log.success(`Updated widget for ${guild.id}`);
					succeeded++;
				} catch (error) {
					this.client.log.warn(`Failed to update widget for ${guild.id}`);
					this.client.log.error(error);
					if (error.message?.match(/(Missing Access)|(Unknown Channel)/)) {
						guild = await this.client.prisma.guild.update({
							data: { voice_channel: null },
							where: { id: guild.id }
						});
						this.client.log.info(`Removed dead voice channel for guild ${guild.id}`);
					}
					failed++;
				} finally {
					tried++;
				}
			}
			this.client.log.info(`Attempted to update widgets of ${tried} guilds, ${succeeded} succeeded and ${failed} failed`);
		};

		updateWidgets();
		setInterval(() => updateWidgets(), ms('1h'));

	}
};