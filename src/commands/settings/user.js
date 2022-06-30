const parseTZ = require('timezone-soft');
const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class UserCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Modify or view your personal settings',
			guild_only: true,
			name: 'user',
			options: [
				{
					description: 'Reset your personal settings',
					name: 'reset',
					type: Command.option_types.SUB_COMMAND
				},
				{
					description: 'Set your personal settings',
					name: 'set',
					options: [
						{
							autocomplete: true,
							description: 'The locale (language) to use',
							name: 'locale',
							required: false,
							type: Command.option_types.STRING
						},
						{
							autocomplete: true,
							description: 'The timezone to use',
							name: 'timezone',
							required: false,
							type: Command.option_types.STRING
						}
					],
					required: false,
					type: Command.option_types.SUB_COMMAND
				},
				{
					description: 'View your personal settings',
					name: 'view',
					type: Command.option_types.SUB_COMMAND
				}
			]
		});
	}

	/**
	 * @param {CommandInteraction} interaction
	 * @returns {Promise<void|any>}
	 */
	async execute(interaction) {
		let u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const locale = u_settings?.locale ?? g_settings?.locale ?? 'en-GB';
		const i18n = this.client.i18n.getLocale(locale);

		const subcommand = interaction.options.getSubcommand(false);

		switch (subcommand) {
		case 'set': {
			if (interaction.options.getString('locale') && !this.client.i18n.locales.includes(interaction.options.getString('locale'))) {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.server.set.invalid_locale.title'))
							.setDescription(i18n('commands.server.set.invalid_locale.description', { url: 'https://lnk.earth/discord' }))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}

			const timezone = interaction.options.getString('timezone')
				? parseTZ(interaction.options.getString('timezone'))[0]?.iana
				: undefined;

			if (interaction.options.getString('timezone') && !timezone) {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.server.set.invalid_timezone.title'))
							.setDescription(i18n('commands.server.set.invalid_timezone.description', { url: 'https://lnk.earth/discord' }))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}

			const data = {
				locale: interaction.options.getString('locale') ?? undefined,
				timezone: timezone ?? undefined
			};
			u_settings = await this.client.prisma.user.upsert({
				create: {
					...data,
					id: interaction.user.id
				},
				update: data,
				where: { id: interaction.user.id }
			});
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.user.set.title'))
						.addField('Locale', `\`${u_settings.locale}\``, true)
						.addField('Timezone', `\`${u_settings.timezone}\``, true)
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}
		case 'reset': {
			await this.client.prisma.guild.delete({ where: { id: interaction.guild.id } });
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.user.reset.title'))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}
		default: {
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.user.view.title'))
						.addField('Locale', `\`${u_settings?.locale ?? 'null'}\``, true)
						.addField('Timezone', `\`${u_settings?.timezone ?? 'null'}\``, true)
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}
		}
	}
};