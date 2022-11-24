const fetch = require('node-fetch');
const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class AboutCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Get information and statistics about the bot',
			name: 'info'
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

		const shards = await this.client.shard.fetchClientValues('guilds.cache.size');
		const guilds = shards.reduce((acc, count) => acc + count, 0);

		const enabled = await this.client.prisma.guild.count({ where: { enabled: true } });
		const ss_events = await this.client.prisma.secretSanta.findMany({ where: { status: 'COMPLETED' } });
		const ss_users = ss_events.map(event => Object.keys(event.users).length).reduce((acc, users) => acc + users);

		const response = await fetch(`https://api.statcord.com/v3/${this.client.user.id}/aggregate`);
		const stats = response.ok ? await response.json() : null;
		const commands = stats  && !stats.error ? stats.data.totalCommands : '?';

		return await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(i18n('commands.info.title'))
					.setDescription(i18n('commands.info.description', {
						about: 'https://christmascountdown.live/about',
						eartharoid: 'https://eartharoid.me'
					}))
					.addField(i18n('commands.info.fields.commands'), String(commands), true)
					.addField(i18n('commands.info.fields.servers'), String(guilds), true)
					.addField(i18n('commands.info.fields.secret_santa_events'), String(ss_events.length), true)
					.addField(i18n('commands.info.fields.secret_santa_users'), String(ss_users), true)
					.addField(i18n('commands.info.fields.counting_in.title'), i18n('commands.info.fields.counting_in.value', enabled, { servers: enabled }), true)
					.addField(i18n('commands.info.fields.more.title'), i18n('commands.info.fields.more.value', { url: 'https://lnk.earth/xb-stats' }), true)
					.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
			]
		});
	}
};