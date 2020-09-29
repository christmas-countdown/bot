/**
 * @package @eartharoid/christmas
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const spacetime = require('spacetime');

module.exports = {
	auto: (guild, timezone) => {	
		let now = spacetime.now(timezone);

		if (now.month() === 11 && now.date() === 1) { // 1st Dec
			guild.client.db.Guild.update({
				enabled: true // enable
			}, {
				where: {
					id: guild.id
				}
			});
		} else if (now.month() === 11 && now.date() === 26) { // 26th Dec
			guild.client.db.Guild.update({
				enabled: false // disable
			}, {
				where: {
					id: guild.id
				}
			});
		}
			
		
	}	
};