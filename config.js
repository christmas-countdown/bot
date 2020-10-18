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
		pretty: 'christmascountdown.live',
		url: 'https://www.christmascountdown.live'
	},
	invite: 'https://www.christmascountdown.live/discord/invite',
	docs: {
		pretty: 'docs.christmascountdown.live/discord',
		main: 'https://docs.christmascountdown.live/discord',
		days_sleeps: 'https://docs.christmascountdown.live/days-vs-sleeps',
		commands: 'https://docs.christmascountdown.live/discord/commands',
		locales: 'https://docs.christmascountdown.live/locales',
		settings: 'https://docs.christmascountdown.live/discord/settings',
		timezones: 'https://docs.christmascountdown.live/timezones',
	},
	support: {
		invite: 'discord.gg/pXc9vyC',
		url: 'https://go.eartharoid.me/discord',
	},
	premium: 'https://www.christmascountdown.live/donate',
	presences: [
		{
			activity: 'the countdown to Christmas',
			type: 'WATCHING'
		},
		{
			activity: 'in the snow',
			type: 'PLAYING'
		},
		{
			activity: 'christmascountdown.live',
			type: 'WATCHING'
		},
	],
	options: {
		prefix: {
			error: 'Invalid prefix. Too long perhaps?',
			premium: false
		},
		locale: {
			error: 'Invalid locale name.',
			premium: false
		},
		timezone: {
			error: 'Invalid timezone name.',
			premium: false
		},
		channel: {
			error: 'Invalid channel mention.',
			premium: false
		},
		role: {
			error: 'Invalid role mention.',
			premium: true
		},
		auto: {
			error: 'Invalid boolean.',
			premium: true
		},
		enabled: {
			error: 'Invalid boolean.',
			premium: false
		},
		mention: {
			error: 'Invalid boolean.',
			premium: true
		},
	},
	cooldown: 5,
	respawn: true, // respawn dead shards?
	debug: false,
};
  