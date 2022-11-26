const { colour } = require('../../../config');
const christmas = require('@eartharoid/christmas');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class DayOfTheWeekCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Get the day of the week that Christmas Day is on',
			name: 'weekday'
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
		const date = christmas.date(timezone);
		const day = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
		const footer = i18n(`countdown.${u_settings?.timezone ? 'user' : 'server'}_timezone`, { timezone });

		return await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(i18n('commands.weekday.title'))
					.setURL('https://christmascountdown.live')
					.setDescription(i18n('commands.weekday.description', {
						day,
						year: date.getFullYear()
					}))
					.setFooter(footer, this.client.user.avatarURL())
			]
		});
	}
};