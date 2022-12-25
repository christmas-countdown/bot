const christmas = require('@eartharoid/christmas');
const {
	colour,
	website
} = require('../config');
const {
	MessageEmbed,
	WebhookClient
} = require('discord.js');
const I18n = require('@eartharoid/i18n');
const i18n = new I18n('en-GB', require('./locales')());
const spacetime = require('spacetime');

/**
 * @param {import('./').manager} manager
 * @param {import('./').prisma} prisma
 * @param {import('./').log} log
 */
module.exports.dispatch = async (manager, prisma, log) => {
	log.info.dispatcher('Running dispatch task');

	const id = await manager.fetchClientValues('user.id', 0);
	const avatar = await manager.fetchClientValues('user.avatar', 0);
	const avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=64`;

	let tried = 0,
		succeeded = 0,
		failed = 0;

	const guilds = await prisma.guild.findMany();

	for (let guild of guilds) {
		if (!guild.webhook) continue; // skip guilds that can't be enabled

		const now = spacetime.now(guild.timezone);

		// enable/disable guilds automatically
		if (guild.auto_toggle) {
			if (now.month() === 11 && now.date() === 1 && !guild.enabled) { // 1st Dec (months are 0-11)
				guild = await prisma.guild.update({
					data: { enabled: true }, // enable
					where: { id: guild.id }
				});
				log.info.dispatcher(`Automatically enabled guild ${guild.id}`);
			} else if (now.month() === 11 && now.date() === 26 && guild.enabled) { // 26th Dec
				guild = await prisma.guild.update({
					data: { enabled: false }, // disable
					where: { id: guild.id }
				});
				log.info.dispatcher(`Automatically disabled guild ${guild.id}`);
			}
		}

		if (!guild.enabled) continue; // skip guild if disabled

		// skip guild if the bot has restarted between 05:00-06:00,
		// or it is not 05:00-06:00 and the last message was sent on time
		if (guild.last_sent) {
			const last = spacetime(guild.last_sent, guild.timezone);
			const diff = last.diff(now, 'hours');
			if (diff <= 1 || (now.hour() !== 5 && diff < 24)) continue;
		} else if (now.hour() !== 5) {
			continue;
		}

		const getMessage = i18n.getLocale(guild.locale ?? 'en-GB');
		const sleeps = christmas.getSleeps(guild.timezone);
		const days = Math.floor(christmas.getDays(guild.timezone));
		const title = christmas.isToday(guild.timezone)
			? getMessage('countdown.christmas_day')
			: christmas.isTomorrow(guild.timezone)
				? getMessage('countdown.christmas_eve')
				: getMessage('commands.sleeps.title', sleeps, { sleeps });
		const text = [
			getMessage('commands.sleeps.description', {
				days: getMessage('commands.sleeps.days', days, { days }),
				sleeps: getMessage('commands.sleeps.sleeps', sleeps, { sleeps }),
				url: 'https://christmascountdown.live/days-vs-sleeps'
			}),
			getMessage('countdown.live', {
				pretty: website.pretty,
				url: website.url
			})
		];

		if (christmas.isToday(guild.timezone)) text.splice(1, 0, getMessage('countdown.merry_christmas'));

		const footer = getMessage('countdown.server_timezone', { timezone: guild.timezone });
		const embed = new MessageEmbed()
			.setColor(colour)
			.setTitle(title)
			.setURL('https://christmascountdown.live')
			.setDescription(text.join('\n\n'))
			.setFooter(footer, avatarURL)
			.setTimestamp();

		const imageId = christmas.isToday(guild.timezone) ? 0 : sleeps <= 25 ? sleeps : null;
		if (imageId !== null) embed.setImage(`https://static.eartharoid.me/christmas-countdown/sleeps-left/en/${imageId}@s.gif`);

		try {
			const webhook = new WebhookClient({ url: guild.webhook });
			await webhook.send({
				content: guild.mention ? `<@&${guild.mention}>` : undefined,
				embeds: [embed]
			});

			if (christmas.isToday(guild.timezone) && !guild.auto_toggle) {
				const serverId = (await manager.broadcastEval(async client => {
					if (client.shard.ids[0] !== 0) return;
					if (client.application.commands.cache.size === 0) await client.application.commands.fetch();
					return client.application.commands.cache.find(cmd => cmd.name === 'server').id;
				}))[0];
				const toggleId = (await manager.broadcastEval(client => client.shard.ids[0] === 0 && client.application.commands.cache.find(cmd => cmd.name === 'toggle').id))[0];
				await webhook.send({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(getMessage('countdown.disable.title'))
							.setDescription(getMessage('countdown.disable.description', {
								review: `https://top.gg/bot/${id}#reviews`,
								server: `</server set:${serverId}>`,
								toggle: `</toggle:${toggleId}>`
							}))
							.setFooter(footer, avatarURL)
							.setTimestamp()
					]
				});
			}

			log.success.dispatcher(`Sent countdown message to ${guild.id}`);

			await prisma.guild.update({
				data: { last_sent: new Date(now.format('iso')) },
				where: { id: guild.id }
			});
			succeeded++;
		} catch (error) {
			log.warn.dispatcher(`Failed to send countdown message to ${guild.id}`);
			log.error.dispatcher(error);
			if (error.message?.match(/Unknown Webhook/)) {
				guild = await prisma.guild.update({
					data: {
						enabled: false,
						webhook: null
					}, // disable
					where: { id: guild.id }
				});
				log.info.dispatcher(`Removed dead webhook for guild ${guild.id}`);
			}
			failed++;
		} finally {
			tried++;
		}
	}

	log.info.dispatcher(`Attempted to send countdown to ${tried} guilds, ${succeeded} succeeded and ${failed} failed`);
	return succeeded;

};