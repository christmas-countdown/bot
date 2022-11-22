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
		return await interaction.showModal(
			new Modal()
				.setCustomId('suggestion')
				.setTitle('Suggestion')
				.addComponents(
					new MessageActionRow()
						.addComponents(
							new TextInputComponent()
								.setCustomId('suggestion')
								.setRequired(true)
								.setStyle('PARAGRAPH')
								.setLabel('Suggestion for Christmas Countdown')
								.setPlaceholder('A suggestion for the Christmas Countdown bot, preferably in English.')
						)
				)
		);
	}
};
