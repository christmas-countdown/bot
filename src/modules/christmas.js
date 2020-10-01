/**
 * @name christmascountdownbot
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
]; 

module.exports = class ChristmasCountdown {
	constructor(timezone) {
		this.timezone = timezone || 'UTC';

		this.now = spacetime.now(timezone);

		///////////////////////////////// FOR TESTING //
		// this.now = spacetime('December 24, 2020', this.timezone); //  FOR TESTING
		/////////////////////////////////			  //

		let year = this.now.year();

		if (this.now.month() === 11 && this.now.date() > 24)
			year++; // if it's already Christmas, set date to next Christmas

		this.christmas = spacetime(`December 25, ${year} 0:00:00`, this.timezone); // midnight on Christmas day
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

	get total() {
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

	get isToday() {
		// a new spacetime is used rather than this.christmas as we want THIS Christmas for certain, not next Christmas
		return this.now.isSame(spacetime(`December 25, ${this.now.year()} 0:00:00`, this.timezone), 'date');
	}

	get isTomorrow() {
		return this.now.isSame(this.christmas.subtract(1, 'days'), 'date');
	}

};