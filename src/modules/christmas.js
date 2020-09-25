/**
 * @package @eartharoid/christmas
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const spacetime = require('spacetime');

const lengths = [
	['seconds', 1000, 1],
	['minutes', 60, 60],
	['hours', 60, 3600],
	['days', 24, 86400],
]; // the order of these is actually important 

module.exports = class ChristmasCountdown {
	constructor(timezone) {
		this.timezone = timezone || 'UTC';

		this.now = spacetime.now(timezone);

		let year = this.now.year();

		if (this.now.month() === 11 && this.now.date() > 24)
			year++; // if it's already Christmas, set date to next Christmas
		
		this.christmas = spacetime(`December 25, ${year} 0:00:00`, this.timezone);
	}

	get months() {
		return this.now.diff(this.christmas, 'months');
	}

	get weeks() {
		return this.now.diff(this.christmas, 'weeks');
	}

	get days() {
		return this.now.diff(this.christmas, 'days');
	}

	get sleeps() {
		return this.days + 1;
	}

	get hours() {
		return this.now.diff(this.christmas, 'hours');
	}

	get minutes() {
		return this.now.diff(this.christmas, 'minutes');
	}

	get seconds() {
		return this.now.diff(this.christmas, 'seconds');
	}

	get live() {
		let live = {
			months_based: this.christmas.since(this.now).diff,
			days_based: {},
		};

		for (let i = 0; i < lengths.length; i++)
			if (i === lengths.length - 1)
				live.days_based[lengths[i][0]] = this[lengths[i][0]];
			else
				live.days_based[lengths[i][0]] = this[lengths[i][0]] - (this[lengths[i + 1][0]] * lengths[i + 1][1]);

		return live;
	}

};