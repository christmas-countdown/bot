const { CommandInteraction } = require('discord.js'); // eslint-disable-line no-unused-vars

module.exports = class Command {
	/**
	 *
	 * @typedef CommandOption
	 * @property {string} name - The option's name
	 * @property {number} type - The option's type (use `Command.option_types`)
	 * @property {string} description - The option's description
	 * @property {CommandOption[]} [options] - The option's options
	 * @property {(string|number)[]} [choices] - The option's choices
	 * @property {boolean} [required] - Is this arg required? Defaults to `false`
	 * @property {boolean} [autocomplete] - Enable autocomplete?
	 */
	/**
	 * Create a new Command
	 * @param {import('../../bot')} client - The Discord Client
	 * @param {Object} data - Command data
	 * @param {string} data.name - The name of the command (3-32)
	 * @param {string} data.description - The description of the command (1-100)
	 * @param {string[]} [data.permissions] - Array of permissions needed for a user to use this command
	 * @param {CommandOption[]} [data.options] - The command's options
	 */
	constructor(client, data) {

		/** The Discord Client */
		this.client = client;

		/** The CommandManager */
		this.manager = this.client.commands;

		/**
		 * The name of the command
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * The command description
		 * @type {string}
		 */
		this.description = data.description;

		this.guild_only = data.guild_only ?? false;

		/**
		 * Array of permissions needed for a user to use this command
		 * @type {string[]}
		 */
		this.permissions = data.permissions ?? [];

		/**
		 * The command options
		 * @type {CommandOption[]}
		 */
		this.options = data.options ?? [];
	}

	/**
	 * The code to be executed when a command is invoked
	 * @abstract
	 * @param {CommandInteraction} interaction - The message that invoked this command
	 */
	async execute(interaction) { } // eslint-disable-line no-unused-vars

	toJSON() {
		return {
			defaultPermission: true,
			description: this.description,
			name: this.name,
			options: this.options,
			type: 'CHAT_MESSAGE'
		};
	}

	static get option_types() {
		return {
			SUB_COMMAND: 1,
			SUB_COMMAND_GROUP: 2,
			STRING: 3, // eslint-disable-line sort-keys
			INTEGER: 4, // eslint-disable-line sort-keys
			BOOLEAN: 5, // eslint-disable-line sort-keys
			USER: 6,
			CHANNEL: 7, // eslint-disable-line sort-keys
			ROLE: 8,
			MENTIONABLE: 9, // eslint-disable-line sort-keys
			NUMBER: 10
		};
	}

};