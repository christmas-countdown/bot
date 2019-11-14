const fs = require('fs');
const Discord = require("discord.js");
const config = require("../config.json");
const database = require("../database.json");
const countdown = require("../functions/countdown.js");
const log = require("leekslazylogger");
const utils = require('../functions/utils.js');
module.exports = {
    name: 'trigger',
    description: 'Manually trigger the daily countdown',
    long: 'Manually trigger the daily countdown - restricted to bot admins only.',
    usage: '',
    aliases: ['none'],
    example: '',
    args: false,
    cooldown: config.cooldown,
    guildOnly: true,
    hide: true,
    restricted: true,
    execute(message, args, db) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };

       countdown.daily(client, db);

        db.query(`SELECT * FROM ${database.table} WHERE enabled = true`, function (err, result) {
            if (err) {
                log.error(err)
            };
            if (config.debug) {
                log.debug(result)
            }
            if (!result) {
                log.warn("No database result");
                channels = "unkown";
            }
            let channels = result.length;
            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setDescription(`**Sending countdown to ${channels} ${utils.plural("server", channels)}**`)
                .setTimestamp()
            message.channel.send({
                embed
            })
        });




        // command ends here
    },
};
