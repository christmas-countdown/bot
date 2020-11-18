/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const spacetime = require('spacetime');

module.exports = class ChristmasCountdown {
	constructor(timezone) {
		this.timezone = timezone || 'UTC';

		this.now = spacetime.now(this.timezone);

		///////////////////////////////// FOR TESTING //
		// this.now = spacetime('December 24, 2020', this.timezone); //  FOR TESTING
		/////////////////////////////////			  //

		let year = this.now.year();

		if (this.now.month() === 11 && this.now.date() > 24) // months are 0 based, because why not?
			year++; // if it's already Christmas, set date to next Christmas

		this.christmas = spacetime(`December 25, ${year} 0:00:00`, this.timezone); // midnight on Christmas day

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

	get total() {
		let n = this.now.diff(this.christmas, 'seconds');
		let days = Math.floor(n / (24 * 3600));

		n = n % (24 * 3600);
		let hours = Math.floor(n / 3600);

		n %= 3600;
		let minutes = Math.floor(n / 60);

		n %= 60;
		let seconds = Math.floor(n);

		let live = {
			months_based: this.christmas.since(this.now).diff,
			days_based: { days, hours, minutes, seconds },
		};

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