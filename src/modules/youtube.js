/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const fs = require('fs');
const { join } = require('path');

module.exports = class YouTube {
	static getName(id) {
		return new Promise((resolve, reject) => {
			fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_KEY}`, {
				headers: {
					'Authorization': process.env.YOUTUBE_KEY,
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			})
				.then(res => res.json())
				.then(json => {
					let video = json.items[0],
						title = video.snippet.title;
					resolve(title);
				}).catch(e => {
					this.client.log.warn(e.message);
					reject(new Error('Could not access video'));
				});
		});
	}

	static async download(id) {
		let info = await ytdl.getInfo(id),
			url = `https://www.youtube.com/watch?v=${id}`;


		return new Promise((resolve, reject) => {
			if (info.formats.find(f => f.container === 'opus') !== -1) {
				// 
				ytdl(url, { filter: format => format.container === 'opus' })
					.pipe(fs.createWriteStream(join(__dirname, `../../music/${id}.ogg`)));
				resolve('opus');
			} else if (info.formats.find(f => f.container === 'mp3') !== -1) {
				ytdl(url, { filter: format => format.container === 'mp3' })
					.pipe(fs.createWriteStream(join(__dirname, `../../music/${id}.mp3`)));
				resolve('mp3');
			} else {
				reject('Not available in OPUS or MP3 format.');
			}
		});

		/* 
		format = ytdl.chooseFormat(info.formats, { filter: () => });
		download = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
			.on('progress', (_, downloaded, total) => {
					console.log(downloaded, '/', total);
			});
			.pipe(fs.createWriteStream(tmp));

		const ffmpegProcess = child.spawn(ffmpeg, [
			`-i ${tmp} -c:a libopus -b:a 96k ${output}`,
		], {
			windowsHide: true,
		});
		ffmpegProcess.on('close', () => {
			console.log('done');
		});
		*/

	}
};