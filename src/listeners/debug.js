const EventListener = require('../modules/listeners/listener');

module.exports = class DebugEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'debug' });
	}

	async execute(data) {
		this.client.log.debug(data);
	}
};