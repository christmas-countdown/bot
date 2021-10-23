const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	Interaction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class InviteCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Add the Christmas Countdown bot to your own Discord server',
			name: 'invite'
		});
	}

	/**
	 * @param {Interaction} interaction
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
					.setTitle(i18n('commands.invite.title'))
					.setURL('https://www.christmascountdown.live/invite')
					.setDescription(i18n('commands.invite.description', { url: 'https://www.christmascountdown.live/invite' }))
					.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
			]
		});
	}
};