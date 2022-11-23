const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	Modal,
	MessageActionRow,
	TextInputComponent
} = require('discord.js');

module.exports = class SuggestCommand extends Command {
	constructor(client) {
		super(client, {
			defer: false,
			description: 'Submit a suggestion or general feedback for the Christmas Countdown bot',
			name: 'suggest',
			options: []
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
		return await interaction.showModal(
			new Modal()
				.setCustomId('suggestion')
				.setTitle(i18n('modals.suggest.title'))
				.addComponents(
					new MessageActionRow()
						.addComponents(
							new TextInputComponent()
								.setCustomId('suggestion')
								.setRequired(true)
								.setStyle('PARAGRAPH')
								.setLabel(i18n('modals.suggest.suggestion.label'))
								.setPlaceholder(i18n('modals.suggest.suggestion.placeholder'))
						)
				)
		);
	}
};
