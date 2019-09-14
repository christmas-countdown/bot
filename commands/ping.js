const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
module.exports = {
  name: 'ping',
  description: 'Calculate latency',
  usage: '',
  aliases: ['none'],
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
        .addField("Pong!", `${Math.round(message.client.ping)}ms`, true)
    message.channel.send({embed})




    // command ends here
  },
};
