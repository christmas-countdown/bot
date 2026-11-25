const EventListener = require('../modules/listeners/listener');

module.exports = class ErrorEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'raw' });
	}

	async execute(raw) {
		if (raw.t !== 'VOICE_STATE_UPDATE' && raw.t !== 'VOICE_SERVER_UPDATE') return;
		// ! the adapter only wants the bot's state
		if (raw.t === 'VOICE_STATE_UPDATE' && raw.d.user_id !== this.client.user.id) return;
		if (!raw.d.guild_id) return;
		this.client.voiceSocket?.send(
			JSON.stringify({
				d: raw.d,
				signal: raw.t === 'VOICE_STATE_UPDATE' ? 'upstate' : 'upserver'
			})
		);
	}
};
