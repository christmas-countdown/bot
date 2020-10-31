/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const spacetime = require('spacetime');
const utils = require('./utils');
const Christmas = require('./christmas');
const { Embed } = require('../bot');

const I18n = require('../locales');
module.exports = class Countdown {
	constructor() {
		throw new Error('Countdown methods must be called statically.');
	}

	static async auto(guild, timezone) {
		let now = spacetime.now(timezone); // now in the timezone
		let settings = await guild.settings();
		if (!settings.channel) return;

		if (now.month() === 11 && now.date() === 1) { // 1st Dec (months are 0-11)
			guild.client.log.console(`Automatically enabled guild ${guild.id}`);
			return await guild.client.db.Guild.update({
				enabled: true // enable
			}, {
				where: {
					id: guild.id
				}
			});
		} else if (now.month() === 11 && now.date() === 26) { // 26th Dec
			guild.client.log.console(`Automatically disabled guild ${guild.id}`);
			return await guild.client.db.Guild.update({
				enabled: false // disable
			}, {
				where: {
					id: guild.id
				}
			});
		}
	}

	static async disable(guild) {
		return await guild.client.db.Guild.update({
			channel: null,
			enabled: false // disable
		}, {
			where: {
				id: guild.id
			}
		});
	}

	static async run(client) {
		client.log.info('Running countdown task');
		let number = 0,
			failed = 0;

		for (const [, guild] of client.guilds.cache) {
			if (!guild.available) {
				client.log.warn(`Guild ${guild.id} not available, skipping`);
				continue;
			}

			let settings = await guild.settings(),
				tz = settings.timezone || 'UTC';

			if (settings.auto) {
				await this.auto(guild, tz);
				settings = await guild.settings(); // previous line may update settings
			}
			if (!settings.enabled) continue; // continue if the guild isn't enabled

			// check the time
			let now = spacetime.now(tz);
			if (now.hour() !== 0) { // not 00:00 - 00:59 in the guild timezone
				if (settings.last) {
					let last = spacetime(settings.last, tz),
						diff = last.diff(now, 'hours');
					if (diff < 24) continue; // continue if last was less than 24h ago
				} else continue; // continue if no last
			}

			// either it is 00:00 - 00:59, or the last was sent over 24 hours ago

			// let channel = await guild.channels.cache.get(settings.channel);
			let channel = await client.channels.fetch(settings.channel);

			if (!channel) {
				this.disable(guild);
				client.log.console(`Disabled guild ${guild.id} - missing channel`);
				continue;
			}

			if (!guild.me.permissionsIn(channel).has(['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'])) {
				this.disable(guild);
				client.log.console(`Disabled guild ${guild.id} - insufficient permissions in channel`);
				continue;
			}

			const i18n = new I18n(settings.locale || 'en-GB');

			let xmas = new Christmas(settings.timezone),
				sleeps = xmas.sleeps;

			let text = i18n.__('christmas.sleeps.text', sleeps),
				footer = i18n.__('christmas.footer', client.config.website.pretty, client.config.website.url);

			let embed = new Embed(null, settings)
				.setURL(client.config.website.url + '/total#sleeps')
				.setDescription(text + '\n\n' + footer)
				.setTimestamp();

			if (xmas.isToday)
				embed
					.setTitle(i18n.__('christmas.xmas_day'))
					.setDescription(`${text}\n\n${i18n.__('christmas.merry_xmas')}\n\n${footer}`);
			else if (xmas.isTomorrow)
				embed
					.setTitle(i18n.__('christmas.xmas_eve'));
			else
				embed
					.setTitle(i18n.__('christmas.sleeps.title', sleeps));

			try {
				if (settings.premium && settings.mention && settings.role)
					channel.send(`<@&${settings.role}>`, embed);
				else
					channel.send(embed);
				
				client.db.Guild.update({
					last: new Date(now.format('iso'))
				}, {
					where: {
						id: guild.id
					}
				}); // update last sent timestamp in database
				
				client.log.console(`Sent countdown to guild ${guild.id}`);
				await utils.wait(200); // add 200ms delay to limit 5 messages per second to avoid being rate limited
			} catch (e) {
				client.log.warn(`Failed to send countdown to guild ${guild.id}`);
				client.log.error(e);
				failed++;
			} finally {
				number++;
			}
		}

		client.log.success(`Sent countdown to ${number} guilds`);
		if (failed > 0)
			client.log.warn(`Failed to send countdown to ${failed} of ${number} guilds`);
	}
	
};
