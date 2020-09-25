/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const {
	Command,
	Flag
} = require('discord-akairo');
const { Embed, i18n: i18nOptions } = require('../../bot');

const { I18n } = require('i18n');
const i18n = new I18n(i18nOptions);

const Christmas = require('../../modules/christmas');

class ServerSettingsCommand extends Command {
	constructor() {
		super('total', {
			aliases: ['total'],
			description: {
				content: 'Get the total time to christmas',
				usage: '[period]',
				examples: [
					'days',
					'sleeps',
					'hours'
				]
			},
			ignorePermissions: process.env.OWNERS.split(',').map(str => str.trim()), // bot owners are exempt 
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	*args() {
		const cmd = yield {
			type: [
				['total-days', 'days'],
				// ['total-sleeps', 'sleeps'],
				// ['total-hours', 'hours'],
			], otherwise: async (message) => {
				let uSettings = await message.author.settings(),
					gSettings = await message.guild?.settings();
		
				i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');

				let xmas = new Christmas(uSettings?.timezone || gSettings?.timezone);

				// ❯ return a promise
				return new Embed(uSettings, gSettings)
					.setDescription(xmas.live)
					.setTimestamp();
				
		
			}
		};

		return Flag.continue(cmd);
	}




}

module.exports = ServerSettingsCommand;