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
        
        const embed = new Discord.RichEmbed()
            .setColor(config.colour)
            .setDescription(`[${config.website}](${config.url})`)
        message.channel.send({
            embed
        })




        // command ends here
    },
};
