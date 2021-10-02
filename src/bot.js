const log = require('./logger/child');

const presences = [
	{
		name: 'the countdown to Christmas  |  /help',
		type: 'WATCHING'
	},
	{
		name: 'in the snow  |  /help',
		type: 'PLAYING'
	},
	{
		name: 'christmascountdown.live  |  /help',
		type: 'WATCHING'
	}
];

const {
	Client,
	Options,
	Intents
} = require('discord.js');
const client = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILDS
	],
	makeCache: Options.cacheWithLimits({
		MessageManager: 0,
		PresenceManager: 0
	}),
	presence: { activities: [presences[Math.floor(Math.random() * presences.length)]] }
});

client.on('ready', () => {
	log.success(`shard ${process.env.SHARDS} connected to discord`);
	setInterval(() => {
		log.debug('updating bot user presence');
		client.user.setPresence({ activities: [presences[Math.floor(Math.random() * presences.length)]] });
	}, 30000); // every minute
});

client.on('messageCreate', message => {
	const regex = new RegExp(`^(x!)|(<@!?${client.user.id}>)`, 'i');
	if (!regex.test(message.content) && message.channel.type !== 'DM') return;

	log.info(`received message from ${message.author.tag}`);
	// message.reply('The Christmas Countdown bot now uses slash commands!\n**Please re-add the bot here: https://christmascountdown.live/invite/.**');
});

client.login();