const { version } = require("../package.json");
const Discord = require("discord.js");
const config = require("../config.json");
const log = require("leekslazylogger");
module.exports = {
	name: 'help',
	description: 'Displays help menu',
	usage: '[command]',
	aliases: ['command', 'commands'],
	example: 'help channel',
	args: false,
	cooldown: config.cooldown,
	guildOnly: true,
	execute(message, args) {
		const client = message.client;
		// command starts here
		if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {
			message.delete()
		};

		const data = [];
		const { commands } = message.client;




			if (!args.length) {
				data.push('__**Commands**__');
				data.push(commands.map(command => `**${config.prefix}${command.name}** : \`${command.description}\``).join('\n'));
				data.push(`\nType \`${config.prefix}help [command]\` for more information about a specific command.\n\n`);

				const embed = new Discord.RichEmbed()
					.setTitle("Commands")
					.setColor(config.colour)
					.setDescription(`\nType \`${config.prefix}help [command]\` for more information about a specific command.\n\n`)
					// .addField("...", `...`, true)
					// .addField("...", `...`, true)
					.setFooter(config.name, client.user.avatarURL);

				var cmds = [];
				cmds.push(commands.map(command => embed.addField(`${config.prefix}${command.name}`, `> ${command.description}`, true)));
				message.channel.send(embed)
					.then(() => {
						if (message.channel.type === 'dm') return;
						// message.channel.send(`A list of commands has been sent to you.`);
					})
					.catch(error => {
						// console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
						log.warn(`Could not DM help menu to ${message.author.tag}, sending to server channel instead`);
						message.channel.send(`:x: **Sorry!** There was an error whilst sending the help menu via DMs.`)
						message.channel.send(data, {
							split: true
						})
					});
			} else {
				const name = args[0].toLowerCase();
				const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

				if (!command) {
					const notCmd = new Discord.RichEmbed()
						.setColor("#E74C3C")
						.setDescription(`:x: **Invalid command name** (\`${config.prefix}help\`)`)
					return message.channel.send(notCmd)
				}

				const cmd = new Discord.RichEmbed()
					.setColor(config.colour)
					.setTitle(command.name);

				
				if (command.long) {
					cmd.setDescription(command.long);
				} else {
					cmd.setDescription(command.description);
				}
				if (command.aliases) cmd.addField("Aliases", `\`${command.aliases.join(', ')}\``, true);
				if (command.usage) cmd.addField("Usage", `\`${config.prefix}${command.name} ${command.usage}\``, true)
				if (command.example) cmd.addField("Example", `\`${config.prefix}${command.example}\``, true);
				if (command.permission) cmd.addField("Required Permission", `\`${command.permission}\``, true);
				message.channel.send(cmd)

			};


		



		// command ends here
	},
};