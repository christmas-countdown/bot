const { colour } = require('../../../config');
const christmas = require('@eartharoid/christmas');
const Command = require('../../modules/commands/command');
const {
	Interaction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class SecondsCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Get the number of seconds left until Christmas',
			name: 'seconds'
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
		const seconds = christmas.getSeconds(timezone);
		const formatted = new Intl.NumberFormat(locale).format(seconds);
		const title = christmas.isToday()
			? i18n('countdown.christmas_day')
			: christmas.isTomorrow()
				? i18n('countdown.christmas_eve')
				: i18n('commands.seconds.title', seconds, { seconds: formatted });
		const text = [
			i18n('commands.seconds.description', seconds, { seconds: formatted }),
			i18n('countdown.live', {
				pretty: 'christmascountdown.live',
				url: 'https://christmascountdown.live'
			})
		];

		if (christmas.isToday()) text.splice(1, 0, i18n('countdown.merry_christmas'));

		return await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(title)
					.setURL('https://christmascountdown.live/total')
					.setDescription(text.join('\n\n'))
					.setFooter(`${i18n('bot.footer')} (${timezone})`, this.client.user.avatarURL())
					.setTimestamp()
			]
		});
	}
};