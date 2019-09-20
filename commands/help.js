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


		const { commands } = message.client;
		// log.debug(Array.from(commands.values()))
	

			if (!args.length) {
				var cmds = [];
				// cmds.push(commands.map(command => `**${config.prefix}${command.name}**\n> ${command.description}`).join('\n\n'));
		
				const embed = new Discord.RichEmbed()
					.setTitle("Commands")
					.setColor(config.colour)
					.setDescription(`\nType \`${config.prefix}help [command]\` for more information about a specific command.\n\n\n${cmds}`)
					// .addField("...", `...`, true)
					// .addField("...", `...`, true)
					.setFooter(config.name, client.user.avatarURL);

				cmds.push(commands.map(command => {
					if (command.hide) return;
					embed.addField(`__**${config.prefix}${command.name}**__`, `${command.description}\n`, false)
				}));
			
				
				message.channel.send(embed)
					.catch(error => {
						// console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
						log.warn(`Could not send help menu`);
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
				if (command.premiumOnly) cmd.addField(":star: Premium", `[donate](${config.url}donate/?utm_source=discord&utm_medium=cmd-embed&utm_campaign=countdown)`, true)
				message.channel.send(cmd)

			};


		



		// command ends here
	},
};