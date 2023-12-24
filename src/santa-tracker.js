const locations = require('../locations.json');
const spacetime = require('spacetime');
const {
	MessageEmbed,
	WebhookClient
} = require('discord.js');
const { colour } = require('../config');
const I18n = require('@eartharoid/i18n');
const i18n = new I18n('en-GB', require('./locales')());

let remaining = [...locations];
let messages = new Map();

let id, avatarURL;

module.exports.track = async (manager, prisma, log) => {

	if (!id || !avatarURL) {
		id = await manager.fetchClientValues('user.id', 0);
		const avatar = await manager.fetchClientValues('user.avatar', 0);
		avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=64`;
	}

	let index;

	if (remaining.length === 1) {
		index = 0;
		// reset it (although the bot will likely be restarted before next Christmas anyway)
		remaining = [...locations];
		messages = new Map();
	} else {
		index = remaining.findIndex(location => {
			const {
				day,
				hour,
				minute
			} = location.departure;
			const now = spacetime.now('UTC');
			let year = now.year();
			if (now.month() === 11 && now.date() > 25) year++; // >25th, not 24th like the countdown
			const departure = spacetime(`December ${day}, ${year} ${hour}:${minute}:00`, 'UTC');
			return departure.isAfter(now);
		});
	}

	if (!index) return;

	const location = remaining[remaining.length === locations.length ? 0 : index];
	remaining.splice(0, index);

	if (!location) {
		log.warn('No location');
		return;
	}

	const map = `https://www.google.com/maps/place/${location.city},+${location.region}/@${location.latitude},${location.longitude},10z`.replace(/\s/g, '+');

	const guilds = await prisma.guild.findMany({ where: { enabled: true } });
	log.info(`Updating Santa's position in ${guilds.length} guilds... (${location.city}, ${location.region})`);

	for (const guild of guilds) {
		if (!guild.webhook) continue;

		const webhook = new WebhookClient({ url: guild.webhook });
		const getMessage = i18n.getLocale(guild.locale ?? 'en-GB');
		const embed = new MessageEmbed()
			.setColor(colour)
			.setTitle(getMessage('santa_tracker.title'))
			.setURL('https://www.noradsanta.org')
			.setFooter(getMessage('bot.footer'), avatarURL)
			.setTimestamp();

		if (remaining.length <= 1) {
			embed
				.setDescription(getMessage('santa_tracker.ended', {
					city: location.city,
					map,
					region: location.region,
					vote: `https://top.gg/bot/${id}/vote`
				}))
				.setImage('https://static.eartharoid.me/christmas-countdown/3d/santa-lying-down.png');
		} else if (remaining.length === locations.length - 1) {
			embed
				.setDescription(getMessage('santa_tracker.starting', {
					city: location.city,
					map,
					region: location.region
				}))
				.setImage('https://static.eartharoid.me/christmas-countdown/3d/sleigh.png');
		} else {
			embed
				.setDescription(getMessage('santa_tracker.description', {
					city: location.city,
					map,
					region: location.region
				}))
				.setImage(`https://santatracker.eartharoid.workers.dev/map-tile/${location.latitude},${location.longitude}`);
		}

		try {
			if (messages.has(guild.id)) await webhook.editMessage(messages.get(guild.id), { embeds: [embed] });
			else messages.set(guild.id, (await webhook.send({ embeds: [embed] })).id);
		} catch (error) {
			log.warn(`Failed to update Santa's position in guild ${guild.id}`);
			log.error(error);
			if (error.message?.match(/Unknown Webhook/)) {
				await prisma.guild.update({
					data: {
						enabled: false,
						webhook: null
					}, // disable
					where: { id: guild.id }
				});
				messages.delete(guild.id);
				log.info(`Removed dead webhook for guild ${guild.id}`);
			}
		}
	}
};