const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
const database = require('../database.json');
module.exports = {
    name: 'toggle',
    description: 'Toggle the daily countdown',
    usage: '',
    aliases: ['none'],
    example: '',
    args: false,
    cooldown: config.cooldown,
    guildOnly: true,
    permission: 'MANAGE_SERVER',
    execute (message, args, db, log) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };

        db.query(`SELECT * FROM ${database.table} WHERE guild = "${message.guild.id}"`, function (err, result) {
            if(err) {
                log.error(err)
            };
            log.debug(result)
            // do something with result
            if(result[0].enabled == 0) {
                // disabled so set to 1 to enable
                // CHECK THAT CHANNEL IS SET FIRST!!!!!!!!!!
            } else {
                // enabled so set to 0 to disbale
            }
        });


        db.query(`UPDATE ${database.table} SET premium = true WHERE guild = "${message.guild.id}"`, function (err, result) {
            if (err) {
                log.error(err)
            };
        log.type.db(result.affectedRows + " record(s) updated");
        });
        db.query(`SELECT * FROM ${database.table} WHERE guild = "${message.guild.id}"`, function (err, result) {
            if (err) {
                log.error(err)
            };
            // do something with result
            log.warn(result[0].premium)
        });





        // command ends here
    },
};
