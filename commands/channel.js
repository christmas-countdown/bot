const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
module.exports = {
    name: 'channel',
    description: 'Set the countdown channel',
    usage: '#channel',
    aliases: ['none'],
    example: 'channel #christmas',
    args: true,
    cooldown: config.cooldown,
    guildOnly: true,
    permission: 'MANAGE_SERVER',
    execute(message, args) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };




        // command ends here
    },
};
