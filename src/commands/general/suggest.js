const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class SuggestCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Submit a suggestion',
			name: 'suggest',
			options: [
				{
					description: 'Your suggestion (please join the support server (/help) for general feedback)',
					name: 'suggestion',
					required: true,
					type: Command.option_types.STRING
				}
			]
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

		const suggestion = interaction.options.getString('suggestion');

		const channel = await this.client.channels.fetch(process.env.SUGGESTIONS_CHANNEL);

		await channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setAuthor(interaction.user.tag, interaction.user.avatarURL())
					.setTitle('Suggestion')
					.setDescription(suggestion)
					.setFooter(interaction.user.id, this.client.user.avatarURL())
			]
		});

		return await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(i18n('commands.suggest.title'))
					.setDescription(i18n('commands.suggest.description'))
					.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
			]
		});
	}
};