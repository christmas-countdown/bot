const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
const countdown = require("../functions/countdown.js")
let urlExt = "?utm_source=discord&utm_medium=cmd-embed&utm_campaign=daysleft";
module.exports = {
    name: 'days',
    description: 'Displays days left',
     long: `Displays the number of days left until Christmas.\n[Understanding: Days vs Sleeps](${config.url}understanding/sleeps-vs-days/${urlExt})`,
    usage: '',
    aliases: ['daysleft', 'day'],
    example: '',
    args: false,
    cooldown: 10,
    guildOnly: true,
    execute(message, args) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };


         if (countdown.daysLeft() === -1) {
             const embed = new Discord.RichEmbed()
                 .setColor(config.colour)
                 .setTitle(`It's Christmas Day!`)
                 .setTimestamp()
                 .setFooter(config.name, client.user.avatarURL);

             if (countdown.message()) {
                 embed.setDescription(`There ${countdown.days().verb} **${countdown.daysLeft()} ${countdown.days().text}** left until Christmas!\n\n${countdown.message()}\n\nWatch the live countdown at [${config.website}](${config.url}${urlExt})`)
             } else {
                 embed.setDescription(`There ${countdown.days().verb} **${countdown.daysLeft()} ${countdown.days().text}** left until Christmas!\n\nWatch the live countdown at [${config.website}](${config.url}${urlExt})`)
             }
             message.channel.send({
                 embed
             })

         } else {
             const embed = new Discord.RichEmbed()
                 .setColor(config.colour)
                 .setTitle(`${countdown.daysLeft()} ${countdown.days().text} left`)
                 .setTimestamp()
                 .setFooter(config.name, client.user.avatarURL);

             if (countdown.message()) {
                 embed.setDescription(`There ${countdown.days().verb} **${countdown.daysLeft()} ${countdown.days().text}** left until Christmas!\n\n${countdown.message()}\n\nWatch the live countdown at [${config.website}](${config.url}${urlExt})`)
             } else {
                 embed.setDescription(`There ${countdown.days().verb} **${countdown.daysLeft()} ${countdown.days().text}** left until Christmas!\n\nWatch the live countdown at [${config.website}](${config.url}${urlExt})`)
             }
             message.channel.send({
                 embed
             })
         }




        // command ends here
    },
};
