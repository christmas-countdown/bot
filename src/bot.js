const { PrismaClient } = require('@prisma/client');
const { inspect } = require('util');
const I18n = require('@eartharoid/i18n');
const ListenerLoader = require('./modules/listeners/loader');
const CommandManager = require('./modules/commands/manager');
const AutocompleteManager = require('./modules/autocomplete/manager');
const SecretSanta = require('./secret-santa');
const {
	Client: DiscordClient,
	LimitedCollection,
	Options,
	Intents
} = require('discord.js');
const { presences } = require('../config');

class Client extends DiscordClient {
	constructor(options) {
		super(options);
		this.log = require('./logger/child');

		/** @type {PrismaClient} */
		this.prisma = new PrismaClient({
			errorFormat: 'pretty',
			log: [
				{
					emit: 'event',
					level: 'query'
				},
				{
					emit: 'event',
					level: 'info'
				},
				{
					emit: 'event',
					level: 'warn'
				},
				{
					emit: 'event',
					level: 'error'
				}
			]
		});

		this.prisma.$on('query', e => this.log.debug(e));
		this.prisma.$on('info', e => this.log.verbose(e));
		this.prisma.$on('warn', e => this.log.warn(e));
		this.prisma.$on('error', e => this.log.critical(e));

		/** @type {I18n} */
		this.i18n = new I18n('en-GB', require('./locales')());

		const listeners = new ListenerLoader(this);
		listeners.load();

		/** @type {CommandManager} */
		this.commands = new CommandManager(this);

		/** @type {AutocompleteManager} */
		this.autocomplete = new AutocompleteManager(this);

		/** @type {SecretSanta} */
		this.secret_santa = new SecretSanta(this);

		this.login();
	}
}

const client = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_SCHEDULED_EVENTS
	],
	makeCache: Options.cacheWithLimits({
		GuildBanManager: 0,
		GuildEmojiManager: 0,
		GuildInviteManager: 0,
		GuildMemberManager: LimitedCollection.filterByLifetime({
			excludeFromSweep: member => member.id === member.client.user.id,
			lifetime: 300
		}),
		GuildStickerManager: 0,
		MessageManager: 0,
		PresenceManager: 0,
		ReactionManager: 0,
		ReactionUserManager: 0,
		ThreadManager: 0,
		UserManager: 0,
		VoiceStateManager: 0
	}),
	presence: { activities: [presences[Math.floor(Math.random() * presences.length)]] }
});


process.on('unhandledRejection', error => {
	client.log.notice('An error was not caught');
	const name = inspect(error)?.match(/PrismaClient(KnownRequest|Initialization)Error/)?.[0];
	if (name) client.log.critical(name);
	client.log.error(error);
});

module.exports = Client;