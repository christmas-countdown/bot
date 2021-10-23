const DTF = require('@eartharoid/dtf'); 
const { colour } = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	Interaction, // eslint-disable-line no-unused-vars
	MessageEmbed
} = require('discord.js');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Get connection information',
			name: 'ping'
		});
	}

	/**
	 * @param {Interaction} interaction
	 * @returns {Promise<void|any>}
	 */
	async execute(interaction) {
		const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		const g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const locale = u_settings?.locale ?? g_settings?.locale ?? 'en-GB';
		const i18n = this.client.i18n.getLocale(locale);
		const dtf = new DTF(locale);

		const shard_id = this.client.shard.ids[0];
		const shards = await this.client.shard.fetchClientValues('ws.ping');
		const average = shards.reduce((acc, count) => acc + count, 0) / shards.length;

		const sent = await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(i18n('commands.ping.calculating'))
					.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
			]
		});

		return await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(colour)
					.setTitle(i18n('commands.ping.title'))
					.addField(i18n('commands.ping.fields.shard_number'), `**${shard_id}**/${this.client.shard.count} (${dtf.suffix(shard_id + 1)})`, false)
					.addField(i18n('commands.ping.fields.shard_ping'), this.client.ws.ping + 'ms', true)
					.addField(i18n('commands.ping.fields.average_ping'), average + 'ms', true)
					.addField(i18n('commands.ping.fields.latency'), sent.createdTimestamp - interaction.createdTimestamp + 'ms', true)
					.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
			]
		});
	}
};