/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Inhibitor } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class MentionInhibitor extends Inhibitor {
	constructor() {
		super('mention', {
			reason: 'mention',
			type: 'all'
		});
	}

	exec(message) {
		const { client } = this;
		const { config } = client;

		if (message.mentions.has(client.user) && !message.content.trim().match(/[a-zA-Z]/gm)) {
			// mention with no command
			message.channel.send(message.author,
				new MessageEmbed()
					.setColor(config.colour)
					.setTitle('Hello!')
			);
			return true;
		} else {
			return false;
		}
	}
}

module.exports = MentionInhibitor;