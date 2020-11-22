/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const fs = require('fs');
const { join } = require('path');
const ytdl = require('ytdl-core');
const YouTube = require('../../modules/youtube');

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
					type: (message, phrase) => {
						try {
							return ytdl.getVideoID(phrase.trim());
						} catch {
							return null;
						}
					},
					otherwise: async () => {
						return new Embed()
							.setTitle('❌ Invalid YouTube ID')
							.setDescription('Please provide a YouTube video ID');
					}
				},
				{
					id: 'name',
					match: 'option',
					flag: '--name',
					otherwise: async () => {
						return new Embed()
							.setTitle('❌ The name of the song is required')
							.setDescription('`name: <title>`');
					}
				},
				{
					id: 'by',
					match: 'option',
					flag: '--by',
					otherwise: async () => {
						return new Embed()
							.setTitle('❌ The artist\'s name is required')
							.setDescription('`by: <artist>`');
					}
				}
			],
		});
	}

	async exec(message, args) {

		

		message.util.send(
			new Embed()
				.setTitle('Downloading...')
		);

		YouTube.download(args.id)
			.then(format => {
				let embed = new Embed()
					.setTitle('✅ Added');

				let description = `"**${args.name}**" by **${args.by}** has been added to the radio playlist. (${args.id})`;

				if (format !== 'opus')
					description += '\n⚠️The song was not available in OPUS format so has been downloaded as an MP3 instead. **Please manually convert it.**';
				
				embed.setDescription(description);

				let path = join(__dirname, '../../../music/playlist.json'),
					tracks = JSON.parse(fs.readFileSync(path));
	
				tracks[args.id] = {
					...args
				};

				fs.writeFileSync(path, JSON.stringify(tracks));

				return message.util.edit(embed);
			})
			.catch(err => {
				return message.util.edit(
					new Embed()
						.setTitle('❌ Error')
						.setDescription(err)
				);
			});


		/* await this.client.db.Music.create({
			id,
			name: args.name,
			by: args.by,
		}); */


	}
}

module.exports = AddSongCommand;