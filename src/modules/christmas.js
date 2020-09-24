/**
 * @package @eartharoid/christmas
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const moment = require('moment-timezone');

const lengths = [
	['seconds', 1000, 1],
	['minutes', 60, 60],
	['hours', 60, 3600],
	['days', 24, 86400],
	['weeks', 7, 604800],
	['months', 30, 2592000]
];

module.exports = class ChristmasCountdown {
	constructor(timezone) {
		this.timezone = timezone || 'UTC';

		this.now = moment();

		let year = this.now.year();

		if (this.now.month === 11 && this.now.date > 24)
			year++; // if it's already Christmas, set date to next Christmas
		
		this.christmas = moment.tz(year + '-12-25 00:00', this.timezone);
	}

	get months() {
		return this.christmas.diff(this.now, 'months');
	}

	get weeks() {
		return this.christmas.diff(this.now, 'weeks');
	}

	get days() {
		return this.christmas.diff(this.now, 'days');
	}

	get sleeps() {
		return this.days + 1;
	}

	get hours() {
		return this.christmas.diff(this.now, 'hours');
	}

	get minutes() {
		return this.christmas.diff(this.now, 'minutes');
	}

	get seconds() {
		return this.christmas.diff(this.now, 'seconds');
	}

	get live() {
		let live = {};
		// let diff = this.christmas.unix() - this.now.unix();
	
		for (let i = 0; i < lengths.length; i++)
			// live[lengths[i][0]] = Math.floor(diff / lengths[i][2]) % (i === lengths.length - 1 ? 12 : lengths[i + 1][1]);
			live[lengths[i][0]] = this[lengths[i][0]] % (i === lengths.length - 1 ? 12 : lengths[i + 1][1]);
		return live;
	}

};