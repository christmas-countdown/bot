const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
const database = require('../database.json');
const utils = require('../functions/utils.js');
module.exports = {
    name: 'mention',
    description: 'Set countdown mention role',
    long: `Setting this will cause the bot to mention/ping a role that you specify when sending the daily countdown message.\n\n**To disable:** \`${config.prefix}mention\`\n**To set/enable:** \`${config.prefix}mention @role\``,
    usage: '@role',
    aliases: ['role'],
    example: 'mention @Christmas Hype',
    args: false,
    cooldown: config.cooldown,
    guildOnly: true,
    permission: 'MANAGE_GUILD',
    premiumOnly: true,
    execute(message, args, db) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };
        let role = message.mentions.roles.first();
        if (!role) {
            db.query(`UPDATE ${database.table} SET mention = false WHERE guild = "${message.guild.id}"`, function (err, result) {
                if (err) {
                    log.error(err)
                };
                if (config.debug) {
                    log.debug(result)
                }
                if (!result) return log.warn("No database result");
                log.console(`${log.colour.redBright("Disabled")} countdown mention for \"${message.guild.name}\"`);
                utils.affected(result.affectedRows, result.changedRows);

                const embed = new Discord.RichEmbed()
                    .setColor(config.colour)
                    .setDescription(`:white_check_mark: **Disabled countdown mention**\nTo set a role & enable, mention a role.\nType \`${config.prefix}help mention\` for more information`);
                message.channel.send({
                    embed
                })
            });
        } else {
            db.query(`UPDATE ${database.table} SET role = ${role.id} WHERE guild = "${message.guild.id}"`, function (err, result) {
                if (err) {
                    log.error(err)
                };
                if (config.debug) {
                    log.debug(result)
                }
                if (!result) return log.warn("No database result");
                log.console(`Set countdown mention role for "${message.guild.name}"`);
                utils.affected(result.affectedRows, result.changedRows);

                db.query(`UPDATE ${database.table} SET mention = true WHERE guild = "${message.guild.id}"`, function (err, result) {
                    if (err) {
                        log.error(err)
                    };
                    if (config.debug) {
                        log.debug(result)
                    }
                    log.console(`${log.colour.greenBright("Enabled")} countdown mention for \"${message.guild.name}\"`);
                    utils.affected(result.affectedRows, result.changedRows);
                });

                const embed = new Discord.RichEmbed()
                    .setColor(config.colour)
                    .setDescription(`:white_check_mark: Set countdown mention role & **enabled** daily mentioning`);
                message.channel.send({
                    embed
                })
            });

        };







        // command ends here
    },
};
