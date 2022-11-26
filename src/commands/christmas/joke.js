const fetch = require('node-fetch');
const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageActionRow,
	MessageButton,
	MessageEmbed
} = require('discord.js');

module.exports = class JokeCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Get a Christmas joke (currently English-only)',
			name: 'joke'
		});
	}

	async downloadJokes() {
		this.client.log.info('Downloading jokes from API');
		return (await fetch('https://cdn.statically.io/gh/christmas-countdown/api/main/jokes/en.json')).json();
	}

	/**
	 * @param {CommandInteraction} interaction
	 * @returns {Promise<void|any>}
	 */
	async execute(interaction) {
		if (!this.jokes) this.jokes = await this.downloadJokes();
		const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const locale = u_settings?.locale ?? g_settings?.locale ?? 'en-GB';
		const i18n = this.client.i18n.getLocale(locale);
		const joke = this.jokes[Math.floor(Math.random() * this.jokes.length)];
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
					.setThumbnail('https://static.eartharoid.me/christmas-countdown/3d/gingerbread-man.png')
					.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
			]
		});
	}
};