const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class ToggleCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Toggle the countdown on/off',
			guild_only: true,
			name: 'toggle',
			permissions: ['MANAGE_GUILD']
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

		if (!g_settings.webhook) {
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.server.set.cannot_enable.title'))
						.setDescription(i18n('commands.server.set.cannot_enable.description', { url: 'https://lnk.earth/xbc:countdown' }))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}

		await this.client.prisma.guild.update({
			data: { enabled: !g_settings.enabled },
			where: { id: interaction.guild.id }
		});

		return await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(i18n(`commands.toggle.${g_settings.enabled ? 'disabled' : 'enabled'}`))
					.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
			]
		});
	}
};