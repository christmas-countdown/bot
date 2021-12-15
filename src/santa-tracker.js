const locations = require('../locations.json');
const spacetime = require('spacetime');
const ms = require('ms');

module.exports = class Tracker {
	constructor({
		manager,
		prisma,
		log
	}) {
		this.manager = manager;
		this.prisma = prisma;
		this.log = log;

		this.interval = setInterval(this.starter, ms('1m'));
	}

	starter() {
		const first = locations[0].arrival;
		const now = spacetime.now('UTC');
		const start = now.date === first.day &&
			now.hour === first.hour &&
			now.minute === first.minute;

		if (start) {
			this.messages = new Map();
			clearInterval(this.interval);
			this.interval = setInterval(() => this.update, ms('2.5m'));
		}
	}

	update() {
		// if (end) {
		// 	clearInterval(this.interval);
		// 	this.interval = setInterval(this.starter, ms('1m'));
		// }
	}
};