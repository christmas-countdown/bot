const { colour } = require('../../config');
const EventListener = require('../modules/listeners/listener');
const {
	MessageEmbed,
	WebhookClient
} = require('discord.js');

module.exports = class InteractionCreateEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'interactionCreate' });
	}

	/**
	 * @param {import('discord.js').ModalSubmitInteraction} interaction
	 */
	async execute(interaction) {
		let g_settings = await this.client.prisma.guild.findUnique({ where: { id: interaction.guild?.id } });
		if (interaction.guild && !g_settings) {
			g_settings = await this.client.prisma.guild.create({
				data: {
					id: interaction.guild.id,
					locale: this.client.i18n.locales.find(l => l === interaction.guild.preferredLocale || l.split('-')[0] === interaction.guild.preferredLocale) ?? 'en-GB'
				}
			});
		}

		let u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		if (!u_settings) {
			u_settings = await this.client.prisma.user.create({
				data: {
					id: interaction.user.id,
					locale: this.client.i18n.locales.find(l => l === interaction.locale || l.split('-')[0] === interaction.locale) ?? 'en-GB'
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
			const id = interaction.customId.split(';');

			if (id[0] === 'suggestion') {
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
			} else if (id[0] === 'add_joke') {
				const question = interaction.fields.getTextInputValue('question');
				const answer = interaction.fields.getTextInputValue('answer');
				const joke_locale = id[1];
				const webhook = new WebhookClient({ url: process.env.JOKES_WEBHOOK });
				await webhook.send({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setAuthor(interaction.user.tag, interaction.user.avatarURL())
							.setTitle('Joke')
							.addField('Question', question)
							.addField('Answer', answer || '*none*')
							.addField('Locale', `\`${joke_locale}\``)
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
	}
};