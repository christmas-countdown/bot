const { readdirSync } = require('fs');

module.exports = class ListenerLoader {
	/**
	 * Create a ListenerLoader instance
	 * @param {import('../../bot').Bot} client
	 */
	constructor(client) {
		/** The Discord Client */
		this.client = client;
	}

	load() {
		const files = readdirSync('./src/listeners')
			.filter(file => file.endsWith('.js'));

		for (let file of files) {
			try {
				file = require(`../../listeners/${file}`);
				const listener = new file(this.client);
				const on = listener.once ? 'once' : 'on';
				if (listener.raw) this.client.ws[on](listener.event, (...data) => listener.execute(...data));
				else this.client[on](listener.event, (...data) => listener.execute(...data));
			} catch (error) {
				this.client.log.warn('An error occurred whilst loading a listener');
				this.client.log.error(error);
			}
		}

	}

};