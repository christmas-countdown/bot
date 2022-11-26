const { colour } = require('../../config');
const EventListener = require('../modules/listeners/listener');
const {
	MessageActionRow,
	MessageButton,
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
		if (interaction.isCommand()) {
			this.client.commands.handle(interaction);
		} else if (interaction.isAutocomplete()) {
			this.client.autocomplete.complete(interaction);
		} else if (interaction.isButton()) {
			const id = interaction.customId.split(';');

			if (id[0] === 'joke') {
				await interaction.deferUpdate();
				const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
				const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
				const i18n = this.client.i18n.getLocale(u_settings?.locale ?? g_settings?.locale);
				const jokes = this.client.commands.commands.get('joke').jokes;
				const joke = jokes[Math.floor(Math.random() * jokes.length)];
				return await interaction.editReply({
					components: [
						new MessageActionRow()
							.setComponents(
								new MessageButton()
									.setCustomId('joke')
									.setStyle('PRIMARY')
									.setEmoji('🔄')
									.setLabel(i18n('commands.joke.button'))
							)
					],
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.addField(i18n('commands.joke.question'), joke.question)
							.addField(i18n('commands.joke.answer'), `||${joke.answer}||`)
							.setThumbnail('https://static.eartharoid.me/x/2022/11/ginger%20breadman_angle.png')
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}
		} else if (interaction.isModalSubmit()) {
			await interaction.deferReply();
			const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
			const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
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