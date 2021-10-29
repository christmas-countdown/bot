const EventListener = require('../modules/listeners/listener');
const { presences } = require('../../config');
const ms = require('ms');

module.exports = class ReadyEventListener extends EventListener {
	constructor(client) {
		super(client, {
			event: 'ready',
			once: true
		});
	}

	async execute() {
		this.client.log.success(`Connected to Discord as "${this.client.user.tag}"`);

		this.client.commands.load();
		this.client.autocomplete.load();

		setInterval(() => {
			this.client.log.debug('updating bot user presence');
			this.client.user.setPresence({ activities: [presences[Math.floor(Math.random() * presences.length)]] });
		}, ms('30s'));
	}
};