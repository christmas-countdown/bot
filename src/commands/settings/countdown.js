const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed,
	Permissions,
	TextChannel // eslint-disable-line no-unused-vars
} = require('discord.js');

module.exports = class CountdownCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Create the countdown webhook',
			guild_only: true,
			name: 'countdown',
			options: [
				{
					description: 'The channel to create the webhook in - defaults to the current channel',
					name: 'channel',
					required: false,
					type: Command.option_types.CHANNEL
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
		const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const i18n = this.client.i18n.getLocale(u_settings?.locale ?? g_settings?.locale);

		/** @type {TextChannel} */
		const channel = interaction.options.getChannel('channel') ?? interaction.channel;

		if (!(['GUILD_NEWS', 'GUILD_TEXT'].includes(channel?.type))) {
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.countdown.invalid_channel.title'))
						.setDescription(i18n('commands.countdown.invalid_channel.description'))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}

		if (!channel?.viewable) {
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.countdown.missing_permission:view.title'))
						.setDescription(i18n('commands.countdown.missing_permission:view.description'))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}

		if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.countdown.missing_permission:webhook.title'))
						.setDescription(i18n('commands.countdown.missing_permission:webhook.description'))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}

		try {
			const webhook = await channel.createWebhook('Christmas Countdown', {
				avatar: this.client.user.avatarURL(),
				reason: 'Christmas!'
			});
			await this.client.prisma.guild.update({
				data: { webhook: webhook.url },
				where: { id: interaction.guild.id }
			});
		} catch {
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('bot.permissions_error.title'))
						.setDescription(i18n('bot.permissions_error.description', {
							add: 'https://christmascountdown.live/discord/add',
							support: 'https://lnk.earth/discord'
						})
						)
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}

		const embed = new MessageEmbed()
			.setColor(colour)
			.setTitle(i18n('commands.countdown.created.title'))
			.setFooter(i18n('bot.footer'), this.client.user.avatarURL());

		if (!g_settings.enabled) {
			const toggle = (await this.client.application.commands.fetch()).find(cmd => cmd.name === 'toggle');
			embed.setDescription(i18n('commands.countdown.created.description', {
				channel: channel.toString(),
				toggle: `</${toggle.name}:${toggle.id}>`
			}));
		}

		return await interaction.editReply({ embeds: [embed] });
	}
};