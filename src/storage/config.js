/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

module.exports = {
	prefix: 'x!',
	colour: '#D5002C',
	website: {
		pretty: 'www.christmascountdown.live',
		url: 'https://www.christmascountdown.live/'
	},
	support: 'https://go.eartharoid.me/discord',
	presence: {
		activities: ['the countdown to Christmas', 'in the snow', 'christmascountdown.live'],
		types: ['WATCHING', 'PLAYING', 'WATCHING']
	}, 
	cooldown: 5,
	respawn: true, // respawn dead shards? // ENABLE IN PROD
	debug: false,
};
  