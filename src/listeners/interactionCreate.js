const { colour } = require('../../config');
const EventListener = require('../modules/listeners/listener');
const {
	Interaction, // eslint-disable-line no-unused-vars
	MessageEmbed,
	WebhookClient
} = require('discord.js');

module.exports = class InteractionCreateEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'interactionCreate' });
	}

	/**
	 * @param {Interaction} interaction
	 */
	async execute(interaction) {
		const locale = this.client.i18n.locales.includes(interaction.guild.preferredLocale)
			? interaction.guild.preferredLocale
			: 'en-GB';
		let g_settings = await this.client.prisma.guild.findUnique({ where: { id: interaction.guild?.id } });
		if (interaction.guild && !g_settings) {
			g_settings = await this.client.prisma.guild.create({
				data: {
					id: interaction.guild.id,
					locale
				}
			});
		}

		if (interaction.isCommand()) {
			this.client.commands.handle(interaction);
		} else if (interaction.isAutocomplete()) {
			this.client.autocomplete.complete(interaction);
		} else if (interaction.isModalSubmit()) {
			await interaction.deferReply();
			const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
			const i18n = this.client.i18n.getLocale(u_settings?.locale ?? g_settings?.locale);
			const suggestion = interaction.fields.getTextInputValue('suggestion');
			const webhook = new WebhookClient({ url: process.env.SUGGESTIONS_WEBHOOK });
			await webhook.send({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setAuthor(interaction.user.tag, interaction.user.avatarURL())
						.setTitle('Suggestion')
						.setDescription(suggestion)
						.setFooter(`${interaction.user.id} (${interaction.guild?.id})`, this.client.user.avatarURL())
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
	}
};