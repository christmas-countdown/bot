const fs = require('fs');
const Discord = require("discord.js");
const config = require("../config.json");
const stats = require("../stats.json");
const database = require("../database.json");
const log = require("leekslazylogger");
const utils = require('../functions/utils.js');
const { version, homepage } = require('../package.json');
module.exports = {
    name: 'about',
    description: 'Information about the bot',
    usage: '',
    aliases: ['info', 'stats'],
    example: '',
    args: false,
    cooldown: 10,
    guildOnly: true,
    execute(message, args, db) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };

        const urlExt = "?utm_source=discord&utm_medium=cmd-embed&utm_campaign=about";

        db.query(`SELECT * FROM ${database.table} WHERE enabled = true`, function (err, result) {
            if (err) {
                log.error(err)
            };
            if (config.debug) {
                log.debug(result)
            }
            if(!result) {
                log.warn("No database result");
                channels = "unkown";
            }
            let channels = result.length;
            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setTitle("Information")
                .setDescription(`*If the \`${config.prefix}\` prefix conflicts with another bot, you can mention the bot instead:\n\`@${client.user.tag} help\`*\n> **Useful pages:**\n> [Days vs Sleeps](${config.url}understanding/days-vs-sleeps/${urlExt})\n> [About](${config.url}about/${urlExt})\n`)
                .addField("Website", `[${config.website}](${config.url}${urlExt})`, true)
                .addField("Total time left", `[${config.website}/total](${config.url}total/${urlExt})`, true)
                .addField("Servers", `${client.guilds.size} ${utils.plural("server", client.guilds.size)}`, true)
                .addField(":star: Premium", `${utils.cache().premium.length} ${utils.plural("server", utils.cache().premium.length)} [\(donate\)](${config.url}donate/${urlExt})`, true)
                .addField("Counting down in", `${channels} ${utils.plural("server", channels)}`, true)
                .addField("Bot version", `v${version}`, true)
                .addField("Discord.JS version", `v${Discord.version}`, true)
                .addField("Node.JS version", `${process.version}`, true)
                .addField("Total joined", `${stats.totalServers}`, true)
                .addField("Support", `[Join server](${config.support})`, true)
                .addField("Created by", `[${config.creator}](${homepage})`, true)
                .setTimestamp()
                .setFooter(`${config.name} | Created by ${config.creator}`, client.user.avatarURL);
            message.channel.send({
                embed
            })
        });

        




        // command ends here
    },
};