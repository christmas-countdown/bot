/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger(); // required for i18n
const { I18n } = require('i18n');
const i18n = new I18n(require('../bot').i18n);

class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping'],
			// channel: 'guild',
		});
	}

	async exec(message) {
		const { client } = message;

		i18n.setLocale((await message.guild.settings()).locale || 'en-GB');

		let embed = new MessageEmbed()
			.setColor(client.config.colour)
			.setTitle(i18n.__('Pong!'))
			.addField(i18n.__('Shard number'), client.shard.ids, false)
			.addField(i18n.__('Avg. ping'), client.ws.ping + 'ms', true)
			.addField(i18n.__('Shard ping'), client.ws.shards.get(client.shard.ids[0]).ping + 'ms', true)
			.setFooter(i18n.__('Christmas Countdown by eartharoid'), client.user.displayAvatarURL());
		let m = await message.channel.send(embed);

		// ❯ return a promise
		return m.edit(embed.addField(i18n.__('Overall latency'), m.createdTimestamp - message.createdTimestamp  + 'ms', true));
		
	}
}

module.exports = PingCommand;