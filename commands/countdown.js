const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
const countdown = require("../functions/countdown.js")
module.exports = {
    name: 'countdown',
    description: 'Displays countdown',
    long: 'Displays the time left until Christmas',
    usage: '',
    aliases: ['none'],
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




        // command ends here
    },
};
