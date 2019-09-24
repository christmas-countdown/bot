const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
const database = require('../database.json');
const utils = require('../functions/utils.js');
module.exports = {
    name: 'premium',
    description: 'Toggle premium server',
    usage: '<server-id>',
    aliases: ['none'],
    example: '',
    args: true,
    cooldown: config.cooldown,
    guildOnly: true,
    hide: true,
    execute(message, args, db, log) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };

        if(message.author.id != config.ownerID) {
            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setDescription(":x: **You do not have permission to run this command!**");
            return message.channel.send({embed})
        }

        let serv = client.guilds.get(args[0])
        if (!serv) {
            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setDescription(`:x: **Server not found**`);
            return message.channel.send({
                embed
            });
        };

        const yes = new Discord.RichEmbed()
            .setColor(config.colour)
            .setDescription(`:white_check_mark: **Given** premium to "${serv.name}"`);

        const no = new Discord.RichEmbed()
            .setColor(config.colour)
            .setDescription(`:white_check_mark: **Removed** premium from "${serv.name}"`);


        function send(embed) {
            message.channel.send(embed)
        }


        db.query(`SELECT * FROM ${database.table} WHERE guild = "${serv.id}"`, function (err, result) {
            if (err) {
                log.error(err)
            };
            if (config.debug) {
                log.debug(result)
            }
            // do something with result
            if (!result) return message.channel.send(":x: No servers found")
            if (result[0].premium === 0) {
                // not premium so set to 1 to enable
                db.query(`UPDATE ${database.table} SET premium = true WHERE guild = "${serv.id}"`, function (err, result) {
                    if (err) {
                        log.error(err)
                    };
                    if (config.debug) {
                        log.debug(result)
                    }
                    log.console(`${log.colour.greenBright("Given")} premium to \"${serv.name}\"`);
                    utils.affected(result.affectedRows, result.changedRows);
                    send(yes);
                    log.info("Pushing cache refresh")
                    utils.refreshCache(db, client, database, config);
                });
            } else {
                // is premium so set to 0 to disable
                db.query(`UPDATE ${database.table} SET premium = false WHERE guild = "${serv.id}"`, function (err, result) {
                    if (err) {
                        log.error(err)
                    };
                    if (config.debug) {
                        log.debug(result)
                    }
                    log.console(`${log.colour.redBright("Removed")} premium from \"${serv.name}\"`);
                    utils.affected(result.affectedRows, result.changedRows);
                    send(no);
                    log.info("Pushing cache refresh")
                    utils.refreshCache(db, client, database, config);
                });
            };
            
        });

        // command ends here
    },
};