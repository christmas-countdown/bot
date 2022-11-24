const {
	colour,
	website
} = require('../../../config');
const christmas = require('@eartharoid/christmas');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class SleepsCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Get the number of sleeps left until Christmas',
			name: 'sleeps'
		});
	}

	/**
	 * @param {CommandInteraction} interaction
	 * @returns {Promise<void|any>}
	 */
	async execute(interaction) {
		const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const locale = u_settings?.locale ?? g_settings?.locale ?? 'en-GB';
		const timezone = u_settings?.timezone ?? g_settings?.timezone ?? 'UTC';
		const i18n = this.client.i18n.getLocale(locale);
		const sleeps = christmas.getSleeps(timezone);
		const days = christmas.getDays(timezone);
		const title = christmas.isToday(timezone)
			? i18n('countdown.christmas_day')
			: christmas.isTomorrow()
				? i18n('countdown.christmas_eve')
				: i18n('commands.sleeps.title', sleeps, { sleeps });
		const text = [
			i18n('commands.sleeps.description', {
				days: i18n('commands.sleeps.days', days, { days }),
				sleeps: i18n('commands.sleeps.sleeps', sleeps, { sleeps }),
				url: 'https://christmascountdown.live/days-vs-sleeps'
			}),
			i18n('countdown.live', {
				pretty: website.pretty,
				url: website.url
			})
		];

		if (christmas.isToday(timezone)) text.splice(1, 0, i18n('countdown.merry_christmas'));

		const footer = i18n(`countdown.${u_settings?.timezone ? 'user' : 'server'}_timezone`, { timezone });

		return await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(title)
					.setURL('https://christmascountdown.live')
					.setDescription(text.join('\n\n'))
					.setFooter(footer, this.client.user.avatarURL())
					.setTimestamp()
			]
		});
	}
};