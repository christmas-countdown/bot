/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

class TogglePremiumCommand extends Command {
	constructor() {
		super('toggle-premium', {
			aliases: ['toggle-premium'],
			description: {
				content: 'Enable/disable premium for a server',
			},
			ownerOnly: true, // process.env.OWNERS split into an array
			prefix: 'x!admin.',
			category: 'admin',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					id: 'id',
					type: (message, phrase) => {
						if (!phrase) return null;
						let match = phrase.match(/\d{17,19}/);
						return match ? match[0] : null;
					},
					default: message => message.guild.id
				}
			],
		});
	}

	async exec(message, args) {

		let row = await this.client.db.Guild.findOne({
			where: {
				id: args.id
			}
		});

		if (!row)
			return message.util.send(
				new Embed()
					.setColor('RED')
					.setTitle('❌ Unknown server')
					.setDescription('Couldn\'t find a server with that ID.')
			);

		row.set('premium', !row.premium);
		row.save(); // like Guild.update(where)

		// ❯ return a promise
		return message.util.send(
			new Embed()
				.setTitle(`✅ Premium ${row.premium ? 'granted' : 'revoked'}`)
				.setDescription(`${row.premium ? 'Enabled' : 'Disabled'} premium for guild \`${args.id}\``)
		);
		
	}
}

module.exports = TogglePremiumCommand;