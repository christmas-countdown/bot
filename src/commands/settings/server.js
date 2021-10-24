const parseTZ = require('timezone-soft');
const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class ServerCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Modify or view your server settings',
			guild_only: true,
			name: 'server',
			options: [
				{
					description: 'Reset your server settings',
					name: 'reset',
					type: Command.option_types.SUB_COMMAND
				},
				{
					description: 'Set your server settings',
					name: 'set',
					options: [
						{
							description: 'Automatically toggle the `enabled` option at the start and end of December?',
							name: 'auto_toggle',
							required: false,
							type: Command.option_types.BOOLEAN
						},
						{
							description: 'Enable the daily countdown message?',
							name: 'enabled',
							required: false,
							type: Command.option_types.BOOLEAN
						},
						{
							choices: client.i18n.locales.map(locale => ({
								name: locale,
								value: locale
							})),
							description: 'The locale (language) to use',
							name: 'locale',
							required: false,
							type: Command.option_types.STRING
						},
						{
							description: 'The role to mention with the countdown message',
							name: 'mention',
							required: false,
							type: Command.option_types.ROLE
						},
						{
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
					description: 'View your server settings',
					name: 'view',
					type: Command.option_types.SUB_COMMAND
				}
			],
			permissions: ['MANAGE_GUILD']
		});
	}

	/**
	 * @param {CommandInteraction} interaction
	 * @returns {Promise<void|any>}
	 */
	async execute(interaction) {
		const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		let g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const i18n = this.client.i18n.getLocale(u_settings?.locale ?? g_settings?.locale ?? 'en-GB');

		const subcommand = interaction.options.getSubcommand(false);

		switch (subcommand) {
		case 'set': {
			const requires_premium = interaction.options.getBoolean('auto_toggle') || interaction.options.getRole('mention');
			if (requires_premium && !g_settings.premium) {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.server.set.premium.title'))
							.setDescription(i18n('commands.server.set.premium.description', { url: 'https://xmasbot.cf/commands#donate' }))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}

			if (!g_settings.webhook && interaction.options.getBoolean('enabled') !== null) {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.server.set.cannot_enable.title'))
							.setDescription(i18n('commands.server.set.cannot_enable.description', { url: 'https://xmasbot.cf/commands#countdown' }))
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
							.setDescription(i18n('commands.server.set.invalid_timezone.description', { url: 'https://go.eartharoid.me/discord' }))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}

			g_settings = await this.client.prisma.guild.update({
				data: {
					auto_toggle: interaction.options.getBoolean('auto_toggle') ?? undefined,
					enabled: g_settings.webhook ? interaction.options.getBoolean('enabled') ?? undefined : false,
					locale: interaction.options.getString('locale') ?? undefined,
					mention: interaction.options.getRole('mention')?.id ?? undefined,
					timezone: timezone ?? undefined
				},
				where: { id: interaction.guild.id }
			});
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.server.set.title'))
						.addField('⭐ Auto Toggle', `\`${g_settings.auto_toggle}\``, true)
						.addField('Enabled', `\`${g_settings.enabled}\``, true)
						.addField('Locale', `\`${g_settings.locale}\``, true)
						.addField('⭐ Mention', g_settings.mention ? `<@&${g_settings.mention}>` : i18n('disabled'), true)
						.addField('Timezone', `\`${g_settings.timezone}\``, true)
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
						.setTitle(i18n('commands.server.reset.title'))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}
		default: {
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.server.view.title'))
						.addField('⭐ Auto Toggle', `\`${g_settings.auto_toggle}\``, true)
						.addField('Enabled', `\`${g_settings.enabled}\``, true)
						.addField('Locale', `\`${g_settings.locale}\``, true)
						.addField('⭐ Mention', g_settings.mention ? `<@&${g_settings.mention}>` : i18n('disabled'), true)
						.addField('Timezone', `\`${g_settings.timezone}\``, true)
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}
		}
	}
};