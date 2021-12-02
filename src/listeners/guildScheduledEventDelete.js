const EventListener = require('../modules/listeners/listener');

module.exports = class GuildScheduledEventDeleteEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'guildScheduledEventDelete' });
	}

	async execute(data) {
		this.client.secret_santa.handleEvent(data);
	}
};