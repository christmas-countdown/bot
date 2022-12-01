const locations = require('../locations.json');
const spacetime = require('spacetime');
const {
	MessageEmbed,
	WebhookClient
} = require('discord.js');
const { colour } = require('../config');
const I18n = require('@eartharoid/i18n');
const i18n = new I18n('en-GB', require('./locales')());

let remaining = locations;
let messages = new Map();

let avatarURL = null;

module.exports.track = async (manager, prisma, log) => {

	if (!avatarURL) {
		const id = await manager.fetchClientValues('user.id', 0);
		const avatar = await manager.fetchClientValues('user.avatar', 0);
		avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=64`;
	}

	const index = remaining.findIndex(location => {
		const {
			day,
			hour,
			minute
		} = location.departure;
		const now = spacetime.now('UTC');
		const departure = spacetime(`December ${day}, ${now.year()} ${hour}:${minute}:00`, 'UTC');
		return departure.isAfter(now);
	});

	if (index) {
		const location = remaining[index];
		remaining.splice(0, index + 1);

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
				.setDescription(getMessage('santa_tracker.description', {
					city: location.city,
					map,
					region: location.region
				}))
				.setImage(`https://santatracker.eartharoid.workers.dev/map-tile/${location.latitude},${location.longitude}`)
				.setFooter(getMessage('bot.footer'), avatarURL)
				.setTimestamp();

			try {
				if (messages.has(guild.id)) await webhook.editMessage(messages.get(guild.id), { embeds: [embed] });
				else messages.set(guild.id, (await webhook.send({ embeds: [embed] })).id);
			} catch (error) {
				log.warn(`Failed to update Santa's position in guild ${guild.id}`);
				log.error(error);
			}
		}

	}

	if (remaining.length === 0) {
		remaining = locations;
		messages = new Map();
	}
};