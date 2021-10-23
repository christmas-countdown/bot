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
		await interaction.deferReply();
		let g_settings = await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		if (interaction.guild && !g_settings) g_settings = await this.client.prisma.guild.create({ data: { id: interaction.guild.id } });
		if (interaction.isCommand()) this.client.commands.handle(interaction);
	}
};