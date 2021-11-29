const EventListener = require('../modules/listeners/listener');

module.exports = class RawEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'raw' });

		this.events = [
			'GUILD_SCHEDULED_EVENT_CREATE',
			'GUILD_SCHEDULED_EVENT_UPDATE',
			'GUILD_SCHEDULED_EVENT_DELETE'
		];
	}

	async execute(event) {

		if (this.events.includes(event.t)) {
			const name = event.t.toLowerCase().replace(/_(\w)/g, ($, $1) => $1.toUpperCase());
			this.client.emit(name, event.d);
		}
	}
};