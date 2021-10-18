const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	Interaction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'List the available commands (and links to documentation)',
			internal: true,
			name: 'help'
		});
	}

	/**
	 * @param {Interaction} interaction
	 * @returns {Promise<void|any>}
	 */
	async execute(interaction) {
		const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const i18n = this.client.i18n.getLocale(u_settings?.locale ?? g_settings?.locale);

		const embed = new MessageEmbed()
			.setColor(colour)
			.setTitle(i18n('commands.general.help.list.title'))
			.setDescription(i18n('commands.general.help.list.description', { discord: 'https://go.eartharoid.me/discord' }))
			.setFooter(i18n('bot.footer'), this.client.user.avatarURL());

		const categories = this.manager.commands.reduce((list, command) => {
			if (command.category && !list.includes(command.category)) list.push(command.category);
			return list;
		}, []);

		categories.forEach(category => {
			const name = category[0].toUpperCase() + category.slice(1);
			const commands = this.manager.commands.filter(command => command.category === category);
			const list = commands.map(command => `[\`${command.premium ? `⭐${command.name}` : command.name}\`](https://xmasbot.cf/commands#${command.name})`);
			embed.addField(`❯ ${name}`, list.join(', '));
		});

		return await interaction.reply({ embeds: [embed] });
	}
};