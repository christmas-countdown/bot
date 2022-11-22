const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class DonateCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Support Christmas Countdown',
			name: 'donate'
		});
	}

	/**
	 * @param {CommandInteraction} interaction
	 * @returns {Promise<void|any>}
	 */
	async execute(interaction) {
		const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const i18n = this.client.i18n.getLocale(u_settings?.locale ?? g_settings?.locale);

		return await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(i18n('commands.donate.title'))
					.setURL('https://lnk.earth/donate')
					.setDescription(i18n('commands.donate.description', { url: 'https://lnk.earth/donate' }))
					.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
			]
		});
	}
};