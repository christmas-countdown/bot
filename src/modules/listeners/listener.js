module.exports = class EventListener {

	/**
	 *
	 * @param {import("../../bot")} client
	 * @param {*} data
	 */
	constructor(client, data) {
		this.client = client;
		this.event = data.event;
		this.raw = data.raw ?? false;
		this.once = data.once ?? false;
	}

};