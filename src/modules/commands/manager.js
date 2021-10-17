const { colour } = require('../../../config');
const {
	Collection,
	MessageEmbed
} = require('discord.js');
const { readdirSync } = require('fs');

module.exports = class CommandManager {
	/**
	 * @param {import('../../bot').Client} client
	 */
	constructor(client) {
		this.client = client;

		/**
		 * @type {Collection<string, import('./command')>}
		 */
		this.commands = new Collection();
	}

	load() {
		const files = readdirSync('../../commands')
			.filter(file => file.endsWith('.js'));

		for (const file of files) {
			try {
				const Command = require(`../../commands/${file}`);
				const command = new Command(this.client);
				this.commands.set(command.name, command);
				this.client.log.info(`Loaded "${command.name}" command`);
			} catch (error) {
				this.client.log.warn('An error occurred whilst loading a command');
				this.client.log.error(error);
			}
		}
	}

	async publish() {
		try {
			await this.client.application.commands.set(this.client.commands.commands);
			this.client.log.success(`Published ${this.client.commands.commands.size} commands`);
		} catch (error) {
			this.client.log.warn('An error occurred whilst publishing the commands');
			this.client.log.error(error);
		}
	}

	/**
	 * @param {Interaction} interaction
	 */
	async handle(interaction) {
		const u_settiings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const i18n = this.client.i18n.getLocale(u_settiings?.locale ?? g_settings?.locale);

		const command = this.commands.get(interaction.commandName);
		if (!command) return;

		const missing_permissions = command.permissions instanceof Array && !interaction.member.permissions.has(command.permissions);
		if (missing_permissions) {
			const perms = command.permissions.map(p => `\`${p}\``).join(', ');
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('bot.missing_permissions.title'))
						.setDescription(i18n('bot.missing_permissions.description', { permissions: perms }))
				],
				ephemeral: true
			});
		}

		try {
			this.client.log.commands(`Executing "${command.name}" command (invoked by ${interaction.user.tag})`);
			await command.execute(interaction);
		} catch (error) {
			this.client.log.warn(`An error occurred whilst executing the ${command.name} command`);
			this.client.log.error(error);
			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('bot.command_execution_error.title'))
						.setDescription(i18n('bot.command_execution_error.description'))
				]
			});
		}
	}

};
