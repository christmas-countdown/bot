const {
	AutocompleteInteraction,
	Collection
} = require('discord.js');
const {
	readdirSync,
	statSync
} = require('fs');

module.exports = class AutocompleteManager {
	/**
	 * @param {import('../../bot')} client
	 */
	constructor(client) {
		this.client = client;

		/**
		 * @type {Collection<string, import('./autocompleter')>}
		 */
		this.completers = new Collection();
	}

	load() {
		const getFiles = (path, acc) => {
			if (!acc) acc = [];
			const files = readdirSync(path);
			files.forEach(file => {
				if (statSync(`${path}/${file}`).isDirectory()) acc = getFiles(`${path}/${file}`, acc);
				else if (file.endsWith('.js')) acc.push(`${path}/${file}`);
			});

			return acc;
		};
		const files = getFiles('./src/autocompleters');

		for (const file of files) {
			try {
				const Autocompleter = require(`../../../${file}`);
				const autocompleter = new Autocompleter(this.client);
				this.completers.set(autocompleter.option, autocompleter);
			} catch (error) {
				this.client.log.warn('An error occurred whilst loading an autocompleter');
				this.client.log.error(error);
			}
		}
	}

	/**
	 * @param {AutocompleteInteraction} interaction
	 */
	async complete(interaction) {
		const option = interaction.options.getFocused(true);
		if (!option) return;

		const completer = this.completers.get(option.name);
		if (!completer) return;

		try {
			await completer.complete(interaction, option.value);
		} catch (error) {
			this.client.log.warn(`An error occurred whilst executing the ${completer.option} autocompleter`);
			this.client.log.error(error);
		}
	}

};
