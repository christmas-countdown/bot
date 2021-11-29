const EventListener = require('../modules/listeners/listener');

module.exports = class GuildScheduledEventUpdateEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'guildScheduledEventUpdate' });
	}

	async execute(data) {
	}
};