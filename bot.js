/**
###############################################################################################

  @name ChristmasCountdown
  @author Eartharoid <eartharoid@gmail.com>
  @license GNU-GPLv3
  @description CountdownToXMAS :: Countdown Bot
  @website https://www.countdowntoxmas.tk/discord

###############################################################################################
*/
// "playing": ["the countdown to Christmas", "x!help", "countdowntoxmas.tk"],
const fs = require('fs');
const Discord = require('discord.js');
const log = require(`leekslazylogger`);
const config = require('./config.json');
const database = require('./database.json');
const keys = require('./keys.json');
const countdown = require("./functions/countdown.js")
const { version } = require('./package.json');
const client = new Discord.Client({
  autoReconnect: true,
  disableEveryone: true
});
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const now = Date.now();
const mysql = require('mysql');
const BotsList = require("dblapi.js");
const dbl = new BotsList(keys.botlist, client);
const Boats = require("boats.js");
const boats = new Boats(keys.boats);

const db = mysql.createConnection({
  host: database.host,
  port: database.port,
  user: database.user,
  password: database.password,
  database: database.name
});


const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

log.init(config.name)
// all log.* functions are logged to ./log/file.log from here onwards
log.info(`Christmas Countdown v${version}`, 'magentaBright')
log.info(`By Eartharoid#2006 (github.com/eartharoid)`, 'magentaBright')
log.info("Starting up...")
log.info("Attempting to connect to database...")

db.connect(function(err) {
  if(err) { // if connection fails
    log.warn("Could not connect to database");
    log.warn(log.colour.bgYellowBright(log.color.black("BOT WILL NOT FUNCTION CORRECTLY")) + log.colour.bgBlack(""));
    return log.error(err);
  }
  // connected
  log.success(`Connected to database (${database.name}@${database.host})`);

  // check table exists
  db.query(`SELECT 1 FROM ${database.table} LIMIT 1;`, function (err, result) {
    if(err) { // if table does not exist
      log.warn(`'${database.table}' table does not exist`)
      log.info(`Creating table...`)
      db.query(`CREATE TABLE ${database.table} (id INT AUTO_INCREMENT PRIMARY KEY, guild VARCHAR(255), channel VARCHAR(255), enabled VARCHAR(255));`, function (err, result) {
        if(err) {
           log.warn("Could not create database table");
           log.warn(log.colour.bgYellowBright(log.color.black("BOT WILL NOT FUNCTION CORRECTLY")) + log.colour.bgBlack(""));
          return log.error(err);
        };
        log.success(`Created '${database.table}' table`); // created table
      });
      
      return;
    };
    log.success(`'${database.table}' table exists`)
  });
});

client.once('ready', () => { // after bot has logged in
  log.info(`Initialising bot...`)
  for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    log.console(`> Loading '${config.prefix}${command.name}' command`);
  }
  log.success(`Connected to Discord API`)
  log.success(`Logged in as ${client.user.tag}`)

  log.info(`Ready to count down in ${client.guilds.size} servers for ${client.users.size} users\n`)


  setInterval(function () {
    client.user.setPresence({game: {name: config.playing[Math.floor(Math.random() * config.playing.length)], type: config.activityType},status: config.status})
    .catch(log.error);
  }, 10000)
  // client.user.setPresence({game: {name: config.playing, type: config.activityType},status: config.status})
  //   // .then(log.basic)
  //   .catch(log.error);

    const embed = new Discord.RichEmbed()
      .setColor("#2ECC71")
      .setDescription(":white_check_mark: **Started succesfully**")
      .setTimestamp()
    client.channels.get(config.logChannel).send(embed)

  setInterval(() => {
    try {
      dbl.postStats(client.guilds.size);
      boats.postStats(client.guilds.size, client.user.id);
    } catch {
      log.error("There was an error whilst posting the server count.")
    }
  }, 1800000); // every 30 mins

  log.info(`There ${countdown.days().verb} ${countdown.daysLeft()} ${countdown.days().text} left`, "yellowBright")
  log.info(`There ${countdown.sleeps().verb} ${countdown.sleepsLeft()} ${countdown.sleeps().text} left`, "yellowBright")

  // [AUTO]  DAILY COUNTDOWN
  setInterval(() => {
    if(countdown.time().hours === "00" && countdown.time().minutes === "01") {
      countdown.daily(client, db);
      log.info("123")
    }
  }, 60000) // every 1 min / 60 secs




});



client.on('message', async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") {
    if (message.author.id === client.user.id) return;
    if (config.logDMs) {
        const embed = new Discord.RichEmbed()
          .setTitle("DM Logger")
          .addField("Username", message.author.tag, true)
          .addField("Message", message.content, true)
          .setTimestamp()
          .setFooter(config.name, client.user.avatarURL);
        client.channels.get(config.logChannel).send(embed)

    } else {
      return;
    };

  }
  if (message.channel.bot) return;



  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${config.prefix})\\s*`);
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  // if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if(!command) return;
  if(commandName == "none") return;



  if (command.guildOnly && message.channel.type !== 'text') {
	   return message.channel.send(`Sorry, this command can only be used in a server.`)
  }

  if (command.args && !args.length) {
    // let reply = `:x: **Arguments were expected but none were provided.**`;
    //
    // if (command.usage) {
    //   reply += `\n**Usage:** \`${config.prefix}${command.name} ${command.usage}\``;
    // }
    //
    // return message.channel.send(reply);
        const embed = new Discord.RichEmbed()
          .setColor("#E74C3C")
          .setDescription(`\n**Usage:** \`${config.prefix}${command.name} ${command.usage}\`\nType \`${config.prefix}help ${command.name}\` for more information`)
        return message.channel.send({embed})

  };


  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
        const embed = new Discord.RichEmbed()
          .setColor("#E74C3C")
          .setDescription(`:x: **Please do not spam commands** (wait ${timeLeft.toFixed(1)}s)`)
        return message.channel.send({embed})

    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);




















  // MUST REMOVE DEV MESSAGE BELOW



  if(message.author.id != config.ownerID) {
    try {
      log.info(`Sending DEV notice to ${message.author.tag}`)
      message.member.send("Hi. Due to the success of the bot last year, I have decided to rewrite the bot to make important improvements for this Christmas, as it was previously barely functional and I had to constantly restart it after crashes.\nDuring the re-development, many functions will not work correctly and the bot may be slow to respond. If something does not work (such as a command), please do not continue to try it, I am aware it does not work and I will fix it eventually.\nThe main feature of the bot (auto countdown) will not be working until close to the release (likely late October). If you have any questions, join https://discord.gg/pXc9vyC .")
    } catch {
      log.warn(`Could not send DEV notice to ${message.author.tag}`)
    }
  }
  
    

    try {
      // check permissions
      if (!message.channel.permissionsFor(message.channel.guild.me).has('EMBED_LINKS') || !message.channel.permissionsFor(message.channel.guild.me).has('SEND_MESSAGES')) {
        if (message.channel.permissionsFor(message.channel.guild.me).has('SEND_MESSAGES')) {
          return message.channel.send(":x: The bot needs \`EMBED_LINKS\` permission.")
        } else {
          try {
            return message.member.send("The bot needs \`SEND_MESSAGES\` and \`EMBED_LINKS\` permissions. Please notify a server admin.");
          } catch {
            return log.warn(`Unable to notify member of permission error`);
          }
          
        }
      };
      // has permissions

      // client.commands.get(command).execute(message, args, config);
      command.execute(message, args); // EXECUTE THE COMMAND


      const embed = new Discord.RichEmbed()
        .setColor(0x009999)
        .setTitle('Command Used')
        .addField("Username", message.author, true)
        .addField("Command", command.name, true)
        .addField(`Server`, `${message.guild.name} \`(${message.guild.id})\``)
        .setTimestamp()
        .setFooter(config.name, client.user.avatarURL);
      client.channels.get(config.logChannel).send({
        embed
      })

      log.console(`${message.author.tag} used the '${command.name}' command (${message.guild.name} / ${message.guild.id})`)



    } catch (error) {
      log.error(error);
      message.channel.send(`:x: **Oof!** An error occured whilst executing that command.\nThe issue has been reported.`);
      log.error(`An unknown error occured whilst executing the '${command.name}' command`);
    }
  
});

client.on('error', error => {
  log.warn(`Potential error detected\n(likely Discord API connection issue)\n`);
  log.error(`Client error:\n${error}`);
});
client.on('warn', (e) => log.warn(`${e}`));

if(config.debug == true){ client.on('debug', (e) => log.debug(`${e}`)) };

process.on('unhandledRejection', error => {
  log.warn(`An error was not caught`);
  log.error(`Uncaught error: \n${error.stack}`);
});
process.on('beforeExit', (code) => {
  log.basic(log.colour.yellowBright(`Disconected from Discord API`));
  log.basic(`Exiting (${code})`);
});

// DBL EVENTS
dbl.on('posted', () => {
  log.info(`Posted server count to bot lists. (${client.guilds.size})`);
});
dbl.on('vote', vote => {
  log.info(`[DBL] Someone (${vote.user}) just voted!`);
});

dbl.on('error', e => {
  log.error(`[DBL] ${e}`);
  // console.log(`\nDBL encountered an error.\n`)
});

client.login(config.token);
