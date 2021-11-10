const { AutocompleteInteraction } = require('discord.js'); // eslint-disable-line no-unused-vars
const Autocompleter = require('../modules/autocomplete/autocompleter');

module.exports = class LocaleCompleter extends Autocompleter {
	constructor(client) {
		super(client, 'locale');
	}

	/**
	 * @param {AutocompleteInteraction} interaction
	 * @param {string} value
	 */
	complete(interaction, value) {
		const options = value ? this.client.i18n.locales.filter(locale => locale.match(new RegExp(value, 'i'))) : this.client.i18n.locales;
		return interaction.respond(options.slice(0, 25).map(option => ({
			name: option,
			value: option
		})));
	}
};