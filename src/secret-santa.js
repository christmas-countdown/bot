const ms = require('ms');

module.exports = class SecretSanta {
	/**
	 * @param {import('./bot')} client
	 */
	constructor(client) {
		this.client = client;
	}

	autoCheck() {
		this.check();
		this.interval = setInterval(() => {
			this.check();
		}, ms('12h'));
	}

	check() {

	}
};