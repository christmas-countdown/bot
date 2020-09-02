const {
	Structures
} = require('discord.js');
const {
	ChildLogger
} = require('leekslazylogger');
const log = new ChildLogger();

Structures.extend('Guild', Guild => {
	class ExtendedGuild extends Guild {
		constructor(client, data) {
			super(client, data);


			this.settings = () => client.db.Guild.findOne({
				where: {
					id: this.id
				}
			});

			if (!this.settings()) {
				client.db.Guild.create(require('../models/guild').defaults(this));
				log.console(log.f(`${global.prefix} Added '&7${this.name}&f' to the database`));
			}


		}
	}

	return ExtendedGuild;
});