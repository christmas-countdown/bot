const Discord = require("discord.js");
const config = require("../config.json");
const database = require("../database.json");
const log = require("leekslazylogger");
const countdown = require("../functions/countdown.js")
const utils = require("../functions/utils.js")
module.exports = {
    name: 'countdown',
    description: 'Displays countdown',
    long: 'Displays the exact time left until Christmas',
    usage: '',
    aliases: ['none'],
    example: '',
    args: false,
    cooldown: 10,
    guildOnly: true,
    premiumOnly: true,
    execute(message, args, db) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };

        const urlExt = "?utm_source=discord&utm_medium=cmd-embed&utm_campaign=countdown";


        if (countdown.daysLeft() === -1) {
            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setTitle(`It's Christmas Day!`)
                .setTimestamp()
                .setFooter(config.name, client.user.avatarURL);

            if (countdown.message()) {
                embed.setDescription(`There ${countdown.days().verb} **${countdown.live().days} ${utils.plural("day", countdown.live().days)}, ${countdown.live().hours} ${utils.plural("hour", countdown.live().hours)}, ${countdown.live().mins} ${utils.plural("minute", countdown.live().mins)} and ${countdown.live().secs} ${utils.plural("second", countdown.live().secs)}** left until Christmas!\n\n${countdown.message()}\n\nWatch the live countdown at [${config.website}](${config.url}${urlExt})`)
            } else {
                embed.setDescription(`There ${countdown.days().verb} **${countdown.live().days} ${utils.plural("day", countdown.live().days)}, ${countdown.live().hours} ${utils.plural("hour", countdown.live().hours)}, ${countdown.live().mins} ${utils.plural("minute", countdown.live().mins)} and ${countdown.live().secs} ${utils.plural("second", countdown.live().secs)}** left until Christmas!\n\nWatch the live countdown at [${config.website}](${config.url}${urlExt})`)
            }
            message.channel.send({
                embed
            })

        } else {
            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setTitle(`${countdown.daysLeft()} ${countdown.days().text} / ${countdown.sleepsLeft()} ${countdown.sleeps().text} left`)
                .setTimestamp()
                .setFooter(config.name, client.user.avatarURL);

            if (countdown.message()) {
                embed.setDescription(`There ${countdown.days().verb} **${countdown.live().days} ${utils.plural("day", countdown.live().days)}, ${countdown.live().hours} ${utils.plural("hour", countdown.live().hours)}, ${countdown.live().mins} ${utils.plural("minute", countdown.live().mins)} and ${countdown.live().secs} ${utils.plural("second", countdown.live().secs)}** left until Christmas!\n\n${countdown.message()}\n\nWatch the live countdown at [${config.website}](${config.url}${urlExt})`)
            } else {
                embed.setDescription(`There ${countdown.days().verb} **${countdown.live().days} ${utils.plural("day", countdown.live().days)}, ${countdown.live().hours} ${utils.plural("hour", countdown.live().hours)}, ${countdown.live().mins} ${utils.plural("minute", countdown.live().mins)} and ${countdown.live().secs} ${utils.plural("second", countdown.live().secs)}** left until Christmas!\n\nWatch the live countdown at [${config.website}](${config.url}${urlExt})`)
            }
            message.channel.send({
                embed
            })
        }




        // command ends here
    },
};