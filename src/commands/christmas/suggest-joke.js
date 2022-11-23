const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	Modal,
	MessageActionRow,
	TextInputComponent
} = require('discord.js');

module.exports = class SuggestJokeCommand extends Command {
	constructor(client) {
		super(client, {
			defer: false,
			description: 'Submit a joke for the Christmas Countdown bot',
			name: 'suggest-joke',
			options: [
				{
					autocomplete: true,
					description: 'The locale (language) of the joke you want to add',
					name: 'locale',
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
		return await interaction.showModal(
			new Modal()
				.setCustomId(`add_joke;${interaction.options.getString('locale')}`)
				.setTitle(i18n('modals.add_joke.title'))
				.addComponents(
					new MessageActionRow()
						.addComponents(
							new TextInputComponent()
								.setCustomId('question')
								.setRequired(true)
								.setStyle('SHORT')
								.setLabel(i18n('modals.add_joke.question.label'))
								.setPlaceholder(i18n('modals.add_joke.question.placeholder'))
						),
					new MessageActionRow()
						.addComponents(
							new TextInputComponent()
								.setCustomId('answer')
								.setRequired(false)
								.setStyle('SHORT')
								.setLabel(i18n('modals.add_joke.answer.label'))
								.setPlaceholder(i18n('modals.add_joke.answer.placeholder'))
						)
				)
		);
	}
};
