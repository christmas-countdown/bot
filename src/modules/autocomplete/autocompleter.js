const { AutocompleteInteraction } = require('discord.js'); // eslint-disable-line no-unused-vars

module.exports = class EventListener {

	/**
	 *
	 * @param {import("../../bot")} client
	 * @param {string} option
	 */
	constructor(client, option) {
		this.client = client;
		this.option = option;
	}

	/**
	 * @absract
	 * @param {AutocompleteInteraction} interaction
	 * @param {string} value
	 */
	complete() {}

};