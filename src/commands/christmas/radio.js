const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class RadioCommand extends Command {
	constructor(client) {
		super(client, {
			description: '24/7 Christmas music',
			name: 'radio'
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

		const vc = interaction.guild.members.me?.voice?.channel ??
			(g_settings.voice_channel ? interaction.guild.channels.cache.get(g_settings.voice_channel) : null);

		if (vc) {
			return await interaction.editReply(
				{
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.radio.join.title'))
							.setDescription(i18n('commands.radio.join.description', { channel: vc.toString() }))
							.setThumbnail('https://static.eartharoid.me/christmas-countdown/3d/santa-on-sled.png')
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				}
			);
		}

		if (this.client.application.commands.cache.size === 0) await this.client.application.commands.fetch();
		const setup = this.client.application.commands.cache.find(cmd => cmd.name === 'setup');

		return await interaction.editReply(
			{
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.radio.setup.title'))
						.setDescription(i18n('commands.radio.setup.description', { setup: `</${setup.name}:${setup.id}>` }))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			}
		);
	}
};
