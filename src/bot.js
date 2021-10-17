const { PrismaClient } = require('@prisma/client');
const I18n = require('@eartharoid/i18n');
const {
	Client: DiscordClient,
	Options,
	Intents
} = require('discord.js');
const { presences } = require('../config');

class Client extends DiscordClient {
	constructor(options) {
		super(options);
		this.log = require('./logger/child');
		/** @type {PrismaClient} */
		this.prisma = new PrismaClient();
		/** @type {I18n} */
		this.i18n = new I18n('en-GB', require('./locales')());
		this.login();
	}
}

new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILDS
	],
	makeCache: Options.cacheWithLimits({
		MessageManager: 0,
		PresenceManager: 0
	}),
	presence: { activities: [presences[Math.floor(Math.random() * presences.length)]] }
});


// client.on('ready', () => {
// 	log.success(`shard ${process.env.SHARDS} connected to discord`);
// 	setInterval(() => {
// 		log.debug('updating bot user presence');
// 		client.user.setPresence({ activities: [presences[Math.floor(Math.random() * presences.length)]] });
// 	}, 30000); // every minute
// });

// client.on('messageCreate', message => {
// 	const regex = new RegExp(`^(x!)|(<@!?${client.user.id}>)`, 'i');
// 	if (!regex.test(message.content) && message.channel.type !== 'DM') return;

// 	log.info(`received message from ${message.author.tag}`);
// 	message.reply('The Christmas Countdown bot now uses slash commands!\n**Please re-add the bot here: https://christmascountdown.live/invite.**');
// });