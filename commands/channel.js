const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
const database = require('../database.json');
const utils = require('../functions/utils.js');
module.exports = {
    name: 'channel',
    description: 'Set the countdown channel',
    usage: '#channel',
    aliases: ['none'],
    example: 'channel #countdown',
    args: true,
    cooldown: config.cooldown,
    guildOnly: true,
    permission: 'MANAGE_GUILD',
    execute(message, args, db) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };
        let chan = message.mentions.channels.first();
        if(!chan) {
            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setDescription(`:x: **You must mention a channel**\nType \`${config.prefix}help channel\` for more information`);
            return message.channel.send({embed});
        };
 

        db.query(`UPDATE ${database.table} SET channel = ${chan.id} WHERE guild = "${message.guild.id}"`, function (err, result) {
            if (err) {
                log.error(err)
            };
             if (config.debug) {
                 log.debug(result)
             }
             if (!result) return log.warn("No database result");
            log.console(`Set countdown channel for "${message.guild.name}"`);
            utils.affected(result.affectedRows, result.changedRows);

            db.query(`UPDATE ${database.table} SET enabled = true WHERE guild = "${message.guild.id}"`, function (err, result) {
                if (err) {
                    log.error(err)
                };
                 if (config.debug) {
                     log.debug(result)
                 }
                log.console(`Automatically ${log.colour.greenBright("enabled")} daily countdown for \"${message.guild.name}\"`);
                utils.affected(result.affectedRows, result.changedRows);
            });

            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setDescription(`:white_check_mark: Countdown channel set & daily countdown **enabled**.`);
            message.channel.send({embed})
        });




        // command ends here
    },
};
