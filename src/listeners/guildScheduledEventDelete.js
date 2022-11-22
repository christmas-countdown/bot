const EventListener = require('../modules/listeners/listener');

module.exports = class GuildScheduledEventDeleteEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'guildScheduledEventDelete' });
	}

	async execute(event) {
		this.client.secret_santa.handleEvent(event);
	}
};