const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
module.exports = {
    name: 'live',
    long: 'Sends the link to the live web countdown',
    description: 'Link to the live countdown',
    usage: '',
    aliases: ['website'],
    example: '',
    args: false,
    cooldown: config.cooldown,
    guildOnly: true,
    execute(message, args) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };

        const urlExt = "?utm_source=discord&utm_medium=cmd-embed&utm_campaign=website";
        
        const embed = new Discord.RichEmbed()
            .setColor(config.colour)
            .setTitle("Countdown to Chrsitmas live")
            .setURL(`${config.url}${urlExt}`)
            .setDescription(`If you want to know exactly how long is left until Christmas, or  the total number of hours, minutes or seconds left, **go to [${config.website}](${config.url}${urlExt}) for a decorative & festive live countdown.**\n`)
        message.channel.send({
            embed
        })




        // command ends here
    },
};
