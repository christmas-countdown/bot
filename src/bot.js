/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const path = require('path');
const fs = require('fs');
const config = require('./storage/config');
const Logger = require('leekslazylogger');
const log = new Logger({
	name: 'Christmas Countdown Bot',
	debug: config.debug,
	logToFile: false,
	keepSilent: true,
});
log.multi(log);

let i18nOptions = {
	directory: path.join(__dirname, 'locales'),
	defaultLocale: 'en-GB',
	retryInDefaultLocale: true,
	logDebugFn: str => {
		log.debug(str);
	},
	logWarnFn: str => {
		log.warn(str);
	},
	logErrorFn: str => {
		log.error(str);
	},
};
module.exports = {
	i18n: i18nOptions,
};
const { I18n } = require('i18n');
const i18n = new I18n(i18nOptions);

const {
	Sequelize,
	Model
} = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
	dialect: 'mysql',
	host: process.env.DB_HOST,
	logging: log.debug
});

class User extends Model {}
User.init(require('./models/user').model, {
	sequelize,
	modelName: 'user'
});

class Guild extends Model {}
Guild.init(require('./models/guild').model, {
	sequelize,
	modelName: 'guild'
});

User.sync();
Guild.sync();


const structures = fs.readdirSync('src/structures').filter(file => file.endsWith('.js'));
for (const structure of structures)
	require(`./structures/${structure}`);

const {
	Intents
} = require('discord.js');

const {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler,
} = require('discord-akairo');

class Client extends AkairoClient {
	constructor() {
		let num = Math.floor(Math.random() * config.presence.activities.length);
		super({
			ownerID: process.env.OWNERS.split(',').map(str => str.trim())
		}, {
			autoReconnect: true,
			ws: {
				intents: Intents.NON_PRIVILEGED,
			},
			presence: {
				name: config.presence.activities[num] + `  |  ${config.prefix}help`,
				type: config.presence.types[num]
			},
			// cache options are only if discord.js is replaced with discord.js-light
			cacheGuilds: true,
			cacheChannels: true,
			cacheOverwrites: false,
			cacheRoles: false,
			cacheEmojis: false,
			cachePresences: false
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: 'src/listeners/'
		});
		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: 'src/inhibitors/'
		});
		this.commandHandler = new CommandHandler(this, {
			directory: 'src/commands/',
			prefix: async message => (await message.guild.settings()).prefix || config.prefix,
			allowMention: true,
			aliasReplacement: /-/g,
			commandUtil: true,
			handleEdits: true,
			defaultCooldown: 5,
		});

		this.commandHandler.resolver.addType('boolean', (message, phrase) => {
			if (!phrase) return null;
			let value = phrase.toLowerCase() === 'true';
			return value || null;
		});

		const timezones = require('timezones.json');
		this.commandHandler.resolver.addType('timezone', (message, phrase) => {
			if (!phrase) return null;
			let tz = timezones.find(zone => 
				zone.value.toLowerCase() === phrase.toLowerCase()
				|| zone.abbr.toLowerCase() === phrase.toLowerCase()
				|| zone.utc.find(z => z  === phrase.toLowerCase())
			);
			return tz || null;
		});

		this.commandHandler.resolver.addType('locale', (message, phrase) => {
			if (!phrase) return null;
			let locale = i18n.getLocales().find(l => l.toLowerCase() === phrase.toLowerCase());
			return locale || null;
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

		this.listenerHandler.setEmitters({
			process: process,
		});

		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.commandHandler.loadAll();

		this.config = config;

		this.db = {
			User,
			Guild
		};

		this.const = {
			footer: 'Christmas Countdown by eartharoid'
		};

	}
}
const client = new Client();
global.prefix = '[SHARD ' + client.shard.ids + ']';

client.login();