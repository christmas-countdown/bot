const {
	colour,
	website
} = require('../../../config');
const christmas = require('@eartharoid/christmas');
const Command = require('../../modules/commands/command');
const {
	Interaction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class TotalCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Get the total time left until Christmas',
			name: 'total'
		});
	}

	/**
	 * @param {Interaction} interaction
	 * @returns {Promise<void|any>}
	 */
	async execute(interaction) {
		const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const locale = u_settings?.locale ?? g_settings?.locale ?? 'en-GB';
		const timezone = u_settings?.timezone ?? g_settings?.timezone ?? 'UTC';
		const i18n = this.client.i18n.getLocale(locale);
		const {
			days,
			hours,
			minutes,
			seconds
		} = christmas.getTotal(timezone);
		const title = christmas.isToday()
			? i18n('countdown.christmas_day')
			: christmas.isTomorrow()
				? i18n('countdown.christmas_eve')
				: i18n('commands.total.title', {
					days: i18n('commands.total.days', days, { days }),
					hours: i18n('commands.total.hours', hours, { hours }),
					minutes: i18n('commands.total.minutes', minutes, { minutes }),
					seconds: i18n('commands.total.seconds', seconds, { seconds })
				});
		const text = [
			i18n('commands.total.description', days, {
				days: i18n('commands.total.days', days, { days }),
				hours: i18n('commands.total.hours', hours, { hours }),
				minutes: i18n('commands.total.minutes', minutes, { minutes }),
				seconds: i18n('commands.total.seconds', seconds, { seconds })
			}),
			i18n('countdown.live', {
				pretty: website.pretty,
				url: website.url
			})
		];

		if (christmas.isToday()) text.splice(1, 0, i18n('countdown.merry_christmas'));

		const footer = i18n(`countdown.${u_settings?.timezone ? 'user' : 'server'}_timezone`, { timezone });

		return await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(title)
					.setURL('https://christmascountdown.live/live')
					.setDescription(text.join('\n\n'))
					.setFooter(footer, this.client.user.avatarURL())
					.setTimestamp()
			]
		});
	}
};