const EventListener = require('../modules/listeners/listener');

module.exports = class GuildScheduledEventhandleEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'guildScheduledEventUpdate' });
	}

	async execute(_event, event) {
		this.client.secret_santa.handleEvent(event);
	}
};