const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed,
	Permissions
} = require('discord.js');
const christmas = require('@eartharoid/christmas');

module.exports = class SetupCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Set up the countdown webhook or widget',
			guild_only: true,
			name: 'setup',
			options: [
				{
					choices: [
						{
							name: 'Webhook (classic daily countdown message)',
							value: 'webhook'
						},
						{
							name: 'Widget (voice channel)',
							value: 'voice'
						}
					],
					description: 'The type of countdown to set up',
					name: 'countdown',
					required: true,
					type: Command.option_types.STRING
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
		const i18n = this.client.i18n.getLocale(u_settings?.locale ?? g_settings?.locale);
		const type = interaction.options.getString('countdown');

		if (type === 'webhook') {
			if (!interaction.channel?.viewable) {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.setup.missing_permission:view.title'))
							.setDescription(i18n('commands.setup.missing_permission:view.description'))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}

			if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.setup.missing_permission:webhook.title'))
							.setDescription(i18n('commands.setup.missing_permission:webhook.description'))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}

			try {
				const webhook = await interaction.channel.createWebhook('Christmas Countdown', {
					avatar: this.client.user.avatarURL(),
					reason: 'Christmas!'
				});
				g_settings = await this.client.prisma.guild.update({
					data: {
						enabled: true,
						webhook: webhook.url
					},
					where: { id: interaction.guild.id }
				});
			} catch {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.setup.webhook_permissions_error.title'))
							.setDescription(i18n('commands.setup.webhook_permissions_error.description', {
								add: 'https://christmascountdown.live/discord/add',
								support: 'https://lnk.earth/discord'
							})
							)
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}

			if (this.client.application.commands.cache.size === 0) await this.client.application.commands.fetch();
			const toggle = this.client.application.commands.cache.find(cmd => cmd.name === 'toggle');

			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.setup.webhook_created.title'))
						.setDescription(i18n('commands.setup.webhook_created.description', {
							channel: interaction.channel.toString(),
							toggle: `</${toggle.name}:${toggle.id}>`
						}))
						.setThumbnail('https://static.eartharoid.me/christmas-countdown/3d/santa-on-sled.png')
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		} else {
			if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.setup.missing_permission:channel.title'))
							.setDescription(i18n('commands.setup.missing_permission:channel.description'))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}

			try {
				const timezone = u_settings?.timezone ?? g_settings?.timezone ?? 'UTC';
				const sleeps = christmas.getSleeps(timezone);
				const hours = Math.floor(christmas.getHours(timezone));
				const name = christmas.isToday(timezone)
					? i18n('widget.christmas_day')
					: christmas.isTomorrow()
						? i18n('widget.christmas_eve', hours, { hours })
						: i18n('widget.normal', { sleeps });
				const channel = await interaction.guild.channels.create(name, {
					permissionOverwrites: [
						{
							allow: [Permissions.FLAGS.VIEW_CHANNEL],
							deny: [Permissions.FLAGS.CONNECT, Permissions.FLAGS.SEND_MESSAGES],
							id: interaction.guild.roles.everyone
						},
						{
							allow: [Permissions.FLAGS.CONNECT, Permissions.FLAGS.MANAGE_CHANNELS],
							deny: [],
							id: interaction.guild.me
						}
					],
					position: 0,
					reason: 'Christmas!',
					type: 'GUILD_VOICE'
				});
				g_settings = await this.client.prisma.guild.update({
					data: { voice_channel: channel.id },
					where: { id: interaction.guild.id }
				});
			} catch (error) {
				this.client.log.error(error);
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.setup.channel_permissions_error.title'))
							.setDescription(i18n('commands.setup.channel_permissions_error.description', {
								add: 'https://christmascountdown.live/discord/add',
								support: 'https://lnk.earth/discord'
							})
							)
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}

			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.setup.channel_created.title'))
						.setDescription(i18n('commands.setup.channel_created.description'))
						.setThumbnail('https://static.eartharoid.me/christmas-countdown/3d/santa-on-sled.png')
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});

		}
	}
};