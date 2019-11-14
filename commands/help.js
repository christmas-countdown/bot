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


		const commands = Array.from(client.commands.values());
		const urlExt = "?utm_source=discord&utm_medium=cmd-embed&utm_campaign=help";
	

			if (!args.length) {
				var cmds = [];
				
				for(command of commands) {
					if(command.hide) continue;
					if(command.permission && !message.member.hasPermission(command.permission)) {
						if (command.premiumOnly) {
							cmds.push(`**${config.prefix}${command.name}**　**·**　${command.description} :exclamation: **★**`);
						} else {
							cmds.push(`**${config.prefix}${command.name}**　**·**　${command.description} :exclamation:`);
						};
						continue;
					}
					if(command.premiumOnly) {
						cmds.push(`**${config.prefix}${command.name}**　**·**　${command.description} **★**`);
					} else {
						cmds.push(`**${config.prefix}${command.name}**　**·**　${command.description}`);
					};
				};
				const embed = new Discord.RichEmbed()
					.setTitle("Commands")
					.setColor(config.colour)
					.setDescription(`\n[Click here for support.](${config.url}discord/${urlExt})\n\nType \`${config.prefix}help [command]\` for more information about a specific command.\n\n\n${cmds.join("\n\n")}\n\n`)
					// .addField("...", `...`, true)
					// .addField("...", `...`, true)
					.setFooter(config.name, client.user.avatarURL);

				// cmds.push(commands.map(command => {
				// 	if (command.hide) return;
				// 	embed.addField(`__**${config.prefix}${command.name}**__`, `${command.description}\n`, false)
				// }));
			
				
				message.channel.send(embed)
					.catch(error => {
						// console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
						log.warn(`Could not send help menu`);
					});
			} else {
				const name = args[0].toLowerCase();
				const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));

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
				if (command.premiumOnly) cmd.addField(":star: Premium", `[donate](${config.url}donate/?utm_source=discord&utm_medium=cmd-embed&utm_campaign=countdown)`, true)
				if (command.permission) {
					if(message.member.hasPermission(command.permission)) {
						cmd.addField("Required Permission", `\`${command.permission}\``, true);
					} else {
						cmd.addField("Required Permission", `\`${command.permission}\` :exclamation: You don't have permission to use this command`, true);
					}
				}
				// !message.member.hasPermission(command.permission)
				// 
				message.channel.send(cmd)

			};


		



		// command ends here
	},
};