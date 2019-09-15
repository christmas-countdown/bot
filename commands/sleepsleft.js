const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
const countdown = require("../functions/countdown.js")
module.exports = {
    name: 'sleepsleft',
    description: 'Displays sleeps left',
    long: 'Displays the number of sleeps left until Christmas',
    usage: '',
    aliases: ['sleeps', 'sleep'],
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

        if(countdown.daysLeft() === -1) {
            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setTitle(`It's Christmas Day!`)
                .setTimestamp()
                .setFooter(config.name, client.user.avatarURL);

            if (countdown.message()) {
                embed.setDescription(`There ${countdown.sleeps().verb} **${countdown.sleepsLeft()} ${countdown.sleeps().text}** left until Christmas!\n\n${countdown.message()}\n\nWatch the live countdown at [${config.website}](${config.url}?utm_source=discord&utm_medium=cmd-embed&utm_campaign=sleepsleft)`)
            } else {
                embed.setDescription(`There ${countdown.sleeps().verb} **${countdown.sleepsLeft()} ${countdown.sleeps().text}** left until Christmas!\n\nWatch the live countdown at [${config.website}](${config.url}?utm_source=discord&utm_medium=cmd-embed&utm_campaign=sleepsleft)`)
            }
            message.channel.send({
                embed
            })

        } else {
            const embed = new Discord.RichEmbed()
                .setColor(config.colour)
                .setTitle(`${countdown.sleepsLeft()} ${countdown.sleeps().text} left`)
                .setTimestamp()
                .setFooter(config.name, client.user.avatarURL);

            if (countdown.message()) {
                embed.setDescription(`There ${countdown.sleeps().verb} **${countdown.sleepsLeft()} ${countdown.sleeps().text}** left until Christmas!\n\n${countdown.message()}\n\nWatch the live countdown at [${config.website}](${config.url}?utm_source=discord&utm_medium=cmd-embed&utm_campaign=sleepsleft)`)
            } else {
                embed.setDescription(`There ${countdown.sleeps().verb} **${countdown.sleepsLeft()} ${countdown.sleeps().text}** left until Christmas!\n\nWatch the live countdown at [${config.website}](${config.url}?utm_source=discord&utm_medium=cmd-embed&utm_campaign=sleepsleft)`)
            }
            message.channel.send({
                embed
            })
        }
        




        // command ends here
    },
};
