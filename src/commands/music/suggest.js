/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const fetch = require('node-fetch');
const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

const ytdl = require('ytdl-core');

class MusicSuggestCommand extends Command {
	constructor() {
		super('music-suggest', {
			aliases: ['music-suggest', 'music-add'],
			category: 'hidden',
			description: {
				content: 'Suggest a Christmas song to be added to the radio playlist',
				usage: '<youtube url>'
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					id: 'youtube',
					// type: /(https?:\/\/)?((www\.)?youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9-]{11})/gmi,
					type: (message, phrase) => {
						try {
							return ytdl.getVideoID(phrase.trim());
						} catch {
							return null;
						}
					},
					otherwise: async message => {
						let uSettings = await message.author.settings(),
							gSettings = await message.guild?.settings();

						const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');
						const prefix = gSettings?.prefix || this.client.config.prefix;

						return new Embed()
							.setTitle(i18n.__('music.suggest.nourl.title'))
							.setDescription(i18n.__('music.suggest.nourl.description'))
							.addField(i18n.__('settings.usage'), `\`${prefix}music suggest <youtube url>\``)
							.addField(i18n.__('settings.help'), `\`${prefix}help music-suggest\``);
					}
				}
			]
		});
	}


	async exec(message, args) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();

		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		
		let channel = await this.client.channels.fetch(process.env.MUSIC),
			id = args.youtube/*.matches[0][4]*/;
		
		fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_KEY}`, {
			headers: {
				'Authorization': process.env.YOUTUBE_KEY,
				'Accept': 'application/json' ,
				'Content-Type': 'application/json' 
			}
		})
			.then(res => res.json())
			.then(json => {
				let video = json.items[0],
					title = video.snippet.title;

				try {
					channel.send(
						new Embed()
							.setAuthor(message.author.username, message.author.displayAvatarURL())
							.setTitle(title)
							.setURL(`https://youtu.be/${id}`)
							.setThumbnail(`https://img.youtube.com/vi/${id}/default.jpg`)
							.setDescription(i18n.__('music.suggest.log.description', message.author.tag))
							.setFooter(id)
					);
				} catch (e) {
					this.client.log.warn('Failed to send music suggestion to log channel');
					this.client.log.error(e);
				}

				// ❯ return a promise
				return message.util.send(
					new Embed()
						.setTitle(i18n.__('music.suggest.embed.title'))
						.setDescription(i18n.__('music.suggest.embed.description', title))
				);
			}).catch(e => {
				this.client.log.warn(e.message);
				return message.util.send(
					new Embed()
						.setTitle(i18n.__('music.suggest.error.title'))
						.setDescription(i18n.__('music.suggest.error.description'))
				);
			});
		
	}
}

module.exports = MusicSuggestCommand;