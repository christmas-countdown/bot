const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
module.exports = {
    name: 'image',
    description: 'Displays a random image',
    long: 'Displays a random Christmas / Winter image from Unsplash',
    usage: '',
    aliases: ['random', 'photo', 'unsplash'],
    example: '',
    args: false,
    cooldown: 10,
    guildOnly: true,
    premiumOnly: true,
    execute(message, args) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
            message.delete()
        };
        const embed = new Discord.RichEmbed()
            .setColor(config.colour)
            .setDescription(`:star: **The random Christmas image command is limited to premium servers.**\n[${config.website}/donate](${config.url}donate/?utm_source=discord&utm_medium=cmd-embed&utm_campaign=countdown)`)
        message.channel.send({
            embed
        })




        // command ends here
    },
};