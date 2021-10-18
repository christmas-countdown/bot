const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
const EventListener = require('../modules/listeners/listener');

module.exports = class InteractionCreateEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'interactionCreate' });
	}

	/**
	 * @param {Interaction} interaction
	 */
	async execute(interaction) {
		if (interaction.isCommand()) this.client.commands.handle(interaction);
	}
};