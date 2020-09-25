/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

global.prefix = 'SHARD ' + process.env.SHARDS;
const path = require('path');
const fs = require('fs');
const config = require('../config');

const Logger = require('leekslazylogger');
const log = new Logger({
	name: 'Christmas Countdown Bot',
	debug: config.debug,
	logToFile: false,
	keepSilent: true,
	custom: {
		basic: {
			prefix: global.prefix
		},
		console: {
			prefix: global.prefix
		},
		info: {
			prefix: global.prefix
		},
		success: {
			prefix: global.prefix
		},
		debug: {
			prefix: global.prefix
		},
		notice: {
			prefix: global.prefix
		},
		warn: {
			prefix: global.prefix
		},
		error: {
			prefix: global.prefix
		}
	}
});

/**
 * Localisation
 */

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

const { I18n } = require('i18n');
const i18n = new I18n(i18nOptions);

/**
 * Analytics
 */
const Countly = require('countly-sdk-nodejs');
Countly.init({
	app_key: process.env.COUNTLY_KEY,
	url: process.env.COUNTLY_HOST,
	debug: false
});
Countly.begin_session();
// Countly.track_errors();

/**
 * Structures
 */

const structures = fs.readdirSync('src/structures').filter(file => file.endsWith('.js'));
for (const structure of structures)
	require(`./structures/${structure}`);

/** MessageEmbed can't be extended like User and Guild */
const {
	MessageEmbed,
	Intents
} = require('discord.js');
	
class Embed extends MessageEmbed {
	constructor(uSettings, gSettings) {
		super();
	
		this.color = client.config.colour;

		if(!uSettings && !gSettings) {
			this.footer = {
				text: client.config.footer,
				iconURL: client.user.displayAvatarURL(),
			};

		} else {
			let timezone = uSettings?.timezone || gSettings?.timezone;
			timezone = `(${uSettings?.timezone ? 'user' : 'server'}) timezone: ${timezone}`;

			this.footer = {
				text: timezone,
				iconURL: client.user.displayAvatarURL(),
			};
		}

	}

}
/** exports */
module.exports = {
	i18n: i18nOptions,
	Embed
};


/**
 * 
 * Database connection & models
 * 
 */

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


/**
 * 
 * Discord client
 * 
 */

const {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler,
} = require('discord-akairo');

class Client extends AkairoClient {
	constructor() {
		let presence = config.presences[Math.floor(Math.random() * config.presences.length)];
		super({
			ownerID: process.env.OWNERS.split(',').map(str => str.trim())
		}, {
			autoReconnect: true,
			ws: {
				intents: Intents.NON_PRIVILEGED,
			},
			presence: {
				activity: {
					name: presence.activity + `  |  ${config.prefix}help`,
					type: presence.type
				}
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
			automateCategories: true,
			allowMention: true,
			aliasReplacement: /-/g,
			commandUtil: true,
			defaultCooldown: 5,
			directory: 'src/commands/',
			handleEdits: true,
			prefix: async message => (await message.guild?.settings())?.prefix || config.prefix, // ?. used to prevent DMs causing error
		});

		this.commandHandler.resolver.addType('boolean', (message, phrase) => {
			if (!phrase) return null;
			phrase = phrase.trim().toLowerCase();
			if(['true', 'yes', 'on', '1'].includes(phrase))
				return [true];
			else if (['false', 'no', 'off', '0'].includes(phrase))
				return [false];
			else
				return null;
		});

		const timezones = require('./storage/timezones.json'); // generated with moment-timezone (moment.tz.names())

		this.commandHandler.resolver.addType('timezone', (message, phrase) => {
			if (!phrase) return null;
			phrase = phrase.trim().toLowerCase();
			let tz = timezones.all.find(zone => zone.toLowerCase() === phrase);
			return tz || null;
		});
		this.commandHandler.resolver.addType('countryCode', (message, phrase) => {
			if (!phrase) return null;
			phrase = phrase.trim().toUpperCase();
			let country = timezones.countries.find(c => c === phrase);
			return country || null;
		});

		this.commandHandler.resolver.addType('locale', (message, phrase) => {
			if (!phrase) return null;
			phrase = phrase.trim().toLowerCase().replace('_', '-');
			let locale = i18n.getLocales().find(l => l.toLowerCase() === phrase);
			return locale || null;
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

		this.listenerHandler.setEmitters({
			process: process,
			commandHandler: this.commandHandler,
		});

		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.commandHandler.loadAll();

		// config and database etc
		this.config = config;
		this.Countly = Countly;
		this.db = {
			User,
			Guild
		};
		this.log = log;

	}
}
const client = new Client();

client.login();
