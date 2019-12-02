const fs = require('fs');
const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
module.exports = {
    name: 'donate',
    description: 'Get premium',
    long: 'Donate a small amount to support Christmas Countdown and activate :star: premium on your server.',
    usage: '',
    aliases: ['none'],
    example: '',
    args: false,
    cooldown: config.cooldown,
    guildOnly: true,
    execute(message, args, db) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        }
        const url = `${config.url}donate/?user=${message.author.id}&server=${message.guild.id}&name=${message.author.username}&utm_source=discord&utm_medium=cmd-embed&utm_campaign=donate`;

        const embed = new Discord.RichEmbed()
            .setColor(config.colour)
            .setTitle(`:star: Donate to get premium`)
            .setAuthor(`${message.author.username} / ${message.guild.name}`, message.author.avatarURL)
            .setDescription(`The link below is tied to **${message.author.tag}** and **${message.guild.name}** - use this command on the server you want to activate premium for.\n\n> **[Click here to activate premium on this server.](${url})**`)
            .setThumbnail(client.user.avatarURL)
            .setTimestamp()
            .setFooter(config.name, client.user.avatarURL);
        message.channel.send({ embed })



        // command ends here
    },
};