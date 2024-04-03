const { colour } = require('../../../config');
const {
	CommandInteraction,	// eslint-disable-line no-unused-vars
	Collection,
	MessageEmbed
} = require('discord.js');
const {
	readdirSync,
	statSync
} = require('fs');
// const Statcord = require('statcord.js');
const { randomUUID } = require('crypto');

module.exports = class CommandManager {
	/**
	 * @param {import('../../bot')} client
	 */
	constructor(client) {
		this.client = client;

		/**
		 * @type {Collection<string, import('./command')>}
		 */
		this.commands = new Collection();
	}

	load() {
		const getFiles = (path, acc) => {
			if (!acc) acc = [];
			const files = readdirSync(path);
			files.forEach(file => {
				if (statSync(`${path}/${file}`).isDirectory()) acc = getFiles(`${path}/${file}`, acc);
				else if (file.endsWith('.js')) acc.push(`${path}/${file}`);
			});

			return acc;
		};
		const files = getFiles('./src/commands');

		for (const file of files) {
			const parts = file.split('/');
			let category = parts[parts.length - 2];
			if (category === 'commands') category = null;
			try {
				const Command = require(`../../../${file}`);
				const command = new Command(this.client);
				command.category = category;
				this.commands.set(command.name, command);
			} catch (error) {
				this.client.log.warn('An error occurred whilst loading a command');
				this.client.log.error(error);
			}
		}
	}

	async publish(guild) {
		try {
			const commands = this.client.commands.commands.map(command => command.toJSON());
			if (guild) await this.client.application.commands.set(commands, guild);
			else await this.client.application.commands.set(commands);
			this.client.log.success(`Published ${this.client.commands.commands.size} commands`);
		} catch (error) {
			this.client.log.warn('An error occurred whilst publishing the commands');
			this.client.log.error(error);
		}
	}

	/**
	 * @param {CommandInteraction} interaction
	 */
	async handle(interaction) {
		let g_settings;
		if (interaction.inGuild()) {
			g_settings = await this.client.prisma.guild.findUnique({ where: { id: interaction.guild?.id } });
			if (!g_settings) {
				g_settings = await this.client.prisma.guild.create({
					data: {
						id: interaction.guild.id,
						locale: this.client.i18n.locales.find(l => l === interaction.guild.preferredLocale || l.split('-')[0] === interaction.guild.preferredLocale) ?? 'en-GB'
					}
				});
			}
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

		const i18n = this.client.i18n.getLocale(u_settings?.locale ?? g_settings?.locale);

		const command = this.commands.get(interaction.commandName);
		if (!command) return;

		if (command.defer !== false) await interaction.deferReply({ ephemeral: command.ephemeral ?? false });

		if (command.guild_only && !interaction.guild) {
			return await interaction[command.defer ? 'editReply' : 'reply']({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('bot.guild_only.title'))
						.setDescription(i18n('bot.guild_only.description', { invite: 'https://christmascountdown.live/discord/add' }))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}

		if (interaction.guild) {
			const missing_permissions = command.permissions instanceof Array && !interaction.member.permissions.has(command.permissions);
			if (missing_permissions && interaction.user.id !== process.env.OWNER) { // let me bypass permissions check ;)
				const permissions = command.permissions.map(p => `\`${p}\``).join(', ');
				return await interaction[command.defer ? 'editReply' : 'reply']({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('bot.member_missing_permissions.title'))
							.setDescription(i18n('bot.member_missing_permissions.description', { permissions }))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					],
					ephemeral: true
				});
			}
		}

		try {
			this.client.log.info(`Executing "${command.name}" command (invoked by ${interaction.user.tag})`);
			await command.execute(interaction);
			// Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, this.client);
		} catch (error) {
			const uuid = randomUUID();
			this.client.log.warn(`An error occurred whilst executing the ${command.name} command`);
			this.client.log.error(uuid);
			this.client.log.error(error);
			await interaction[command.defer ? 'editReply' : 'reply']({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('bot.command_execution_error.title'))
						.setDescription(i18n('bot.command_execution_error.description', { url: 'https://lnk.earth/discord' }))
						.addField(i18n('bot.command_execution_error.identifier'), `\`\`\`\n${uuid}\n\`\`\``)
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				],
				ephemeral: true
			});
		}
	}

};
