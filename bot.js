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
const cache = require('./cache.json');
const stats = require('./stats.json');
const countdown = require("./functions/countdown.js");
const utils = require("./functions/utils.js");
const {
  version
} = require('./package.json');
const client = new Discord.Client({
  autoReconnect: true,
  disableEveryone: true
});
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
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

function now() {
  return Date.now();
}

const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

log.init(config.name, {
  custom: {
    db: {
      title: "MySQL",
      colour: "cyanBright"
    }
  }
});
// all log.* functions are logged to ./log/file.log from here onwards
log.info(`Christmas Countdown v${version}`, 'magentaBright')
log.info(`By Eartharoid#2006 (github.com/eartharoid)`, 'magentaBright')
log.info("Starting up...")
log.info("Attempting to connect to database...")

db.connect(function (err) {
  // db.query(`DROP TABLE ${database.table}`) // reset database for testing purposes // MUST DISABLE!!!!!
  if (err) { // if connection fails
    log.warn("Could not connect to database");
    log.warn(log.colour.bgYellowBright(log.color.black("BOT WILL NOT FUNCTION CORRECTLY")) + log.colour.bgBlack(""));
    return log.error(err);
  }
  // connecte

  log.success(`Connected to database (${database.name}@${database.host})`);

  // check table exists
  db.query(`SELECT 1 FROM ${database.table} LIMIT 1;`, function (err, result) {

    if (err) { // if table does not exist
      log.warn(`'${database.table}' table does not exist`)
      log.info(`Creating table...`)
      db.query(`CREATE TABLE ${database.table} (id INT AUTO_INCREMENT PRIMARY KEY, guild VARCHAR(255), channel VARCHAR(255), role VARCHAR(255), enabled BOOLEAN, mention BOOLEAN, premium BOOLEAN);`, function (err, result) {
        if (err) {
          log.warn("Could not create database table");
          log.warn(log.colour.bgYellowBright(log.color.black("BOT WILL NOT FUNCTION CORRECTLY")) + log.colour.bgBlack(""));
          return log.error(err);
        };
        log.type.db(`Created '${database.table}' table`); // created table
      });

      return;
    };
    log.success(`'${database.table}' table exists`)
  });
});

client.once('ready', async () => { // after bot has logged in
  log.info(`Initialising bot...`)
  for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    log.console(`> Loading "${config.prefix}${command.name}" command`);
  }
  log.success(`Connected to Discord API`)
  log.success(`Logged in as ${client.user.tag}`)


  log.info(`Starting database check for ${client.guilds.size} servers...`);
  client.guilds.forEach(g => {
    db.query(`SELECT * FROM ${database.table} WHERE guild = "${g.id}"`, function (err, result) {
      if (err) {
        log.error(err)
      };

      if (!result[0]) {
        db.query(`INSERT INTO ${database.table} (guild, enabled, premium) VALUES ("${g.id}", false, false);`, function (err, result) {
          if (err) {
            log.warn("Could not insert row into database table");
            return log.error(err);
          };
          log.type.db(`"${g.name}" added to the database`);
          if (config.debug) {
            log.debug(result)
          };
        });

      }
    });
  });


  log.info(`Ready to count down in ${client.guilds.size} servers for ${client.users.size} users\n`);

  setInterval(function () {
    client.user.setPresence({
        game: {
          name: config.playing[Math.floor(Math.random() * config.playing.length)],
          type: config.activityType
        },
        status: config.status
      })
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




  utils.refreshCache(db, client, database, config);

  setInterval(() => {
    utils.refreshCache(db, client, database, config)
  }, 3600000) // every hour

  // log.info(`There ${countdown.days().verb} ${countdown.daysLeft()} ${countdown.days().text} left`, "yellowBright")
  // log.info(`There ${countdown.sleeps().verb} ${countdown.sleepsLeft()} ${countdown.sleeps().text} left`, "yellowBright")
  // log.info(countdown.live())
  // [AUTO]  DAILY COUNTDOWN
  setInterval(() => {
    if (countdown.time().hours === "01" && countdown.time().minutes === "00") {
      countdown.daily(client, db);
    }
  }, 60000) // every 1 min / 60 secs


});



client.on('message', async message => {
  if (message.author.bot) return;
  let cont = message.content.toLowerCase()
  if (message.channel.type === "dm") {
    if (message.author.id === client.user.id) return;
    if (config.logDMs) {
      const embed = new Discord.RichEmbed()
        .setTitle("DM Logger")
        .addField("Username", message.author.tag, true)
        .addField("Message", cont, true)
        .setTimestamp()
        .setFooter(config.name, client.user.avatarURL);
      client.channels.get(config.logChannel).send(embed)
      log.console(`Received a message from ${message.author.tag}: "${cont}"`)
    } else {
      return;
    };

  }



  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${config.prefix})\\s*`);
  if (!prefixRegex.test(cont)) return;
  const [, matchedPrefix] = cont.match(prefixRegex);
  const args = cont.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  // if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;
  if (commandName == "none") return;



  if (command.guildOnly && message.channel.type !== 'text') {
    return message.channel.send(`Sorry, this command can only be used in a server.`)
  }


  if(command.premiumOnly) {
    if(!cache.premium.includes(message.guild.id)){
      log.console(`${message.author.tag} tried to use the "${command.name}" command on a non-premium server`);
      const embed = new Discord.RichEmbed()
        .setColor(config.colour)
        .setDescription(`:star: **The \`${command.name}\` command is limited to premium servers.**\n[${config.website}/donate](${config.url}donate/?utm_source=discord&utm_medium=premium-embed&utm_campaign=${command.name})`);
      return message.channel.send({ embed });
    }
  };

  if (command.permission && !message.member.hasPermission(command.permission)) {
    const embed = new Discord.RichEmbed()
      .setColor(config.colour)
      .setDescription(`**You must have \`${command.permission}\` permission to use this command**\nType \`${config.prefix}help ${command.name}\` for more information`);
    return message.channel.send({ embed });
  };

  if (command.args && !args.length) {
    const embed = new Discord.RichEmbed()
      .setColor(config.colour)
      .setDescription(`**Usage:** \`${config.prefix}${command.name} ${command.usage}\`\nType \`${config.prefix}help ${command.name}\` for more information`);
    return message.channel.send({ embed });
  };



  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || config.cooldown) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now() < expirationTime) {
      const timeLeft = (expirationTime - now()) / 1000;
      const embed = new Discord.RichEmbed()
        .setColor(config.colour)
        .setDescription(`:x: **Please do not spam commands** (wait ${timeLeft.toFixed(1)}s)`)
      return message.channel.send({
        embed
      })

    }
  }
  timestamps.set(message.author.id, now());
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


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
    command.execute(message, args, db, log); // EXECUTE THE COMMAND


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

    log.console(`${message.author.tag} used the "${command.name}" command (${message.guild.name} / ${message.guild.id})`)



  } catch (error) {
    log.error(error.stack);
    message.channel.send(`:x: **Oof!** An error occured whilst executing that command.\nThe issue has been reported.`);
    log.error(`An unknown error occured whilst executing the '${command.name}' command`);
  }

});


client.on('guildCreate', guild => {
  log.success(`Added to "${guild.name}" / ${guild.id} (${client.guilds.size})`);
  let servers = Array.from(client.guilds).length;
  try {
    // send message
    if (servers.toString().split().slice(servers - 2, servers) == "00") {
      log.info(`"${guild.name}" is the ${utils.nth(servers)} server!`, "greenBright")
      guild.owner.send(`> "${guild.name}" is the **${utils.nth(servers)}** server! :tada:`)
    }
    guild.owner.send(`**Thank you** for adding the Christmas Countdown bot to your server!\nPlease ensure you have given the bot permission to \`SEND_MESSAGES\` and \`EMBED_LINKS\` in any channel you want it to be able to respond to commands in.\nFor a list of commands, type \`x!help\`. If the prefix conflicts with another bot, you can use \`@${client.user.tag} help\` instead.\n\n> If you want the bot to send a message saying how many sleeps are left every morning, use \`x!channel [#channel]\`\n\nPlease consider donating a small amount at https://www.countdowntoxmas.tk/donate/ for access to premium-only commands on your server.`, {
      split: true
    })
  } catch {
    log.warn(`Could not send thank you message to ${guild.owner}`)
  }
  const embed = new Discord.RichEmbed()
    .setColor(0x009999)
    .setTitle('Added to a server')
    .addField("Owner", guild.owner, true)
    .addField(`Server`, `${guild.name} \`(${guild.id})\``, true)
    .setTimestamp()
    .setFooter(config.name, client.user.avatarURL);
  client.channels.get(config.logChannel).send({
    embed
  })
  db.query(`SELECT * FROM ${database.table} WHERE guild = "${guild.id}"`, function (err, result) {
    if (err) {
      log.error(err)
    };
    if (!result) return log.warn("No database result");
    if (result[0]) return log.info(`"${guild.name}" is already in the database ${log.colour.yellowBright("(premium)")}`);
    log.type.db(`Inserting "${guild.name}"`)
    db.query(`INSERT INTO ${database.table} (guild, enabled, premium) VALUES ("${guild.id}", false, false);`, function (err, result) {
      if (err) {
        log.warn("Could not insert row into database table");
        return log.error(err);
      };
      utils.affected(result.affectedRows);
      stats.totalServers = stats.totalServers + 1;
      fs.writeFileSync("./stats.json", JSON.stringify(stats), (err) => console.error);
      if (config.debug) {
        log.debug(result)
      };
    });
  });

});

client.on('guildDelete', guild => {
  log.info(`Removed from "${guild.name}" / ${guild.id} (${client.guilds.size})`);
  
    // send message
    guild.owner.send(`**Thank you** for using the Christmas Countdown bot!\nPlease consider sharing your experience with me at https://www.countdowntoxmas.tk/thank-you/survey so I know what I can do to improve the bot next year. :)`, {
      split: true
    }).catch(() => {
      log.warn(`Could not send leaving message to ${guild.owner}`)
    });
  

  const embed = new Discord.RichEmbed()
    .setColor(0x009999)
    .setTitle('Removed from a server')
    .addField("Owner", guild.owner, true)
    .addField(`Server`, `${guild.name} \`(${guild.id})\``, true)
    .setTimestamp()
    .setFooter(config.name, client.user.avatarURL);
  client.channels.get(config.logChannel).send({
    embed
  })
  db.query(`SELECT * FROM ${database.table} WHERE guild = "${guild.id}"`, function (err, result) {
    if (err) {
      log.error(err)
    };
    if (!result) return log.warn("No database result");
    if (result[0].premium === 1) return log.info(`"${guild.name}" is premium, not removing it from the database`);
    log.type.db(`Removing "${guild.name}"`)
    db.query(`DELETE FROM ${database.table} WHERE guild = "${guild.id}";`, function (err, result) {
      if (err) {
        log.warn("Could not delete row from database table");
        return log.error(err);
      };
      utils.affected(result.affectedRows);
      if (config.debug) {
        log.debug(result)
      };
    });
  });
});



client.on('error', error => {
  log.warn(`Potential error detected\n(likely Discord API connection issue)\n`);
  log.error(`Client error:\n${error}`);
});

client.on('warn', (e) => log.warn(`${e}`));

if (config.debug == true) {
  client.on('debug', (e) => log.debug(`${e}`))
};

process.on('unhandledRejection', error => {
  log.warn(`An error was not caught`);
  log.error(`Uncaught error: \n${error.stack}`);
});

process.on('beforeExit', (code) => {
  log.info(log.colour.yellowBright(`Disconected from Discord API`));
  log.info(`Exiting (${code})`);
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
});

client.login(config.token);
