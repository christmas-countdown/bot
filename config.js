/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

module.exports = {
	prefix: 'x!',
	colour: '#D5002C',
	footer: 'Christmas Countdown by eartharoid',
	website: {
		pretty: 'www.christmascountdown.live',
		url: 'https://www.christmascountdown.live/'
	},
	docs: {
		commands: 'https://docs.christmascountdown.live/discord/commands',
		locales: 'https://docs.christmascountdown.live/locales',
		settings: 'https://docs.christmascountdown.live/discord/settings',
		timezones: 'https://docs.christmascountdown.live/timezones',
	},
	support: 'https://go.eartharoid.me/discord',
	presences: [
		{
			activity: '',
			type: 'WATCHING'
		},
		{
			activity: 'in the snow',
			type: 'PLAYING'
		},
		{
			activity: 'the countdown to Christmas',
			type: 'PLAYING'
		},
	],
	cooldown: 5,
	respawn: true, // respawn dead shards?
	debug: false,
};
  