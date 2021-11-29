const EventListener = require('../modules/listeners/listener');

module.exports = class GuildScheduledEventCreateEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'guildScheduledEventCreate' });
	}

	async execute(data) {

		if (data.entity_metadata?.location?.toLowerCase() !== 'christmas countdown') return;
	}
};