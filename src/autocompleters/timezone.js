const timezones = require('../../timezones.json');
const { AutocompleteInteraction } = require('discord.js'); // eslint-disable-line no-unused-vars
const Autocompleter = require('../modules/autocomplete/autocompleter');

module.exports = class TimezoneCompleter extends Autocompleter {
	constructor(client) {
		super(client, 'timezone');
	}

	/**
	 * @param {AutocompleteInteraction} interaction
	 * @param {string} value
	 */
	complete(interaction, value) {
		const options = value ?  timezones.filter(tz => tz.match(new RegExp(value, 'i'))) : timezones;
		return interaction.respond(options.slice(0, 25).map(option => ({
			name: option,
			value: option
		})));
	}

};