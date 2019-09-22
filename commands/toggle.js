const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
const database = require('../database.json');
const utils = require('../functions/utils.js');
module.exports = {
    name: 'toggle',
    description: 'Toggle the daily countdown',
    usage: '',
    aliases: ['none'],
    example: '',
    args: false,
    cooldown: 10,
    guildOnly: true,
    permission: 'MANAGE_GUILD',
    execute(message, args, db, log) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };
        const notSet = new Discord.RichEmbed()
            .setColor(config.colour)
            .setDescription(`\n**The countdown channel has not been set!**\nYou must use \`${config.prefix}channel\` to set the channel before enabling the daily countdown.`);

        const enabled = new Discord.RichEmbed()
            .setColor(config.colour)
            .setDescription(":white_check_mark: The daily countdown has been **enabled**.");

        const disabled = new Discord.RichEmbed()
            .setColor(config.colour)
            .setDescription(":white_check_mark: The daily countdown has been **disabled**.");
        
        
        function send(embed){
            message.channel.send(embed)
        }


        db.query(`SELECT * FROM ${database.table} WHERE guild = "${message.guild.id}"`, function (err, result) {
            if (err) {
                log.error(err)
            };
            if (config.debug) {
                log.debug(result)
            }
            // do something with result
            if (!result) return log.warn("No database result");
            if (!result[0].channel) return send(notSet); // check channel is set
            if (result[0].enabled === 0) {
                // disabled so set to 1 to enable
                db.query(`UPDATE ${database.table} SET enabled = true WHERE guild = "${message.guild.id}"`, function (err, result) {
                    if (err) {
                        log.error(err)
                    };
                     if (config.debug) {
                         log.debug(result)
                     }
                    log.console(`${log.colour.greenBright("Enabled")} daily countdown for \"${message.guild.name}\"`);
                    utils.affected(result.affectedRows, result.changedRows);
                    send(enabled);
                });
            } else {
                // enabled so set to 0 to disable
                db.query(`UPDATE ${database.table} SET enabled = false WHERE guild = "${message.guild.id}"`, function (err, result) {
                    if (err) {
                        log.error(err)
                    };
                     if (config.debug) {
                         log.debug(result)
                     }
                    log.console(`${log.colour.redBright("Disabled")} daily countdown for \"${message.guild.name}\"`);
                    utils.affected(result.affectedRows, result.changedRows);
                    send(disabled)
                });
            }
        });

    // command ends here
    },
};