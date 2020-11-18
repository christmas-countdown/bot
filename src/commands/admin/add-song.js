/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

class AddSongCommand extends Command {
	constructor() {
		super('add-song', {
			aliases: ['add-song', 'add-music'],
			description: {
				content: 'Add a song to the database',
			},
			ownerOnly: true, // process.env.OWNERS split into an array
			prefix: 'x!admin.',
			category: 'admin',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					id: 'id',
					match: 'option',
					flag: '--id',
					type: /[a-zA-Z0-9-]{11}/gm,
					otherwise: async () => {
						return new Embed()
							.setTitle(':x: Invalid youtube ID')
							.setDescription('Please provide a youtube video ID');
					}
				},
				{
					id: 'name',
					match: 'option',
					flag: '--name',
					otherwise: async () => {
						return new Embed()
							.setTitle(':x: The name of the song is required')
							.setDescription('`name: <title>`');
					}
				},
				{
					id: 'by',
					match: 'option',
					flag: '--by',
					otherwise: async () => {
						return new Embed()
							.setTitle(':x: The artist\'s name is required')
							.setDescription('`by: <artist>`');
					}
				}
			],
		});
	}

	async exec(message, args) {

		let id = args.id.match[0];

		this.client.db.Music.create({
			id,
			name: args.name,
			by: args.by,
		});

		return message.util.send(
			new Embed()
				.setTitle(':white_check_mark: Added')
				.setDescription(`"**${args.name}**" by **${args.by}** has been added to the radio playlist. (${id})`)
		);

	}
}

module.exports = AddSongCommand;