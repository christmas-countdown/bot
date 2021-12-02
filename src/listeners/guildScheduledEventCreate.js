const EventListener = require('../modules/listeners/listener');

module.exports = class GuildScheduledEventCreateEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'guildScheduledEventCreate' });
	}

	async execute(data) {
		this.client.secret_santa.handleEvent(data);
	}
};