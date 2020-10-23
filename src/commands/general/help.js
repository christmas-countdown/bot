/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed } = require('../../bot');

const I18n = require('../../locales');

class HelpCommand extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'commands', 'command'],
			description: {
				content: 'Show bot ping',
				usage: '[command]',
				examples: [
					'server'
				],
				premium: false
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					id: 'command',
					type: 'commandAlias',
				},
			],
		});
	}

	async exec(message, { command }) {
		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
			
		
		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		const prefix = gSettings?.prefix || this.client.config.prefix;

		if (!command) {
			const embed = new Embed()
				.setTitle(i18n.__('general.help.title'))
				.setURL(this.client.config.docs.commands)
				.setDescription(i18n.__('general.help.description',
					`${prefix}help <command>`, this.client.config.docs.days_sleeps));

			for (const category of this.handler.categories.values()) {
				if (['admin', 'hidden', 'sub'].includes(category.id)) continue;
				embed.addField(
					`❯ ${category.id.replace(/(\b\w)/gi, (lc) => lc.toUpperCase())}`,
					`${category
						.filter(cmd => cmd.aliases.length > 0)
						.map(cmd => `[\`${cmd.description.premium ? '⭐' : ''}${cmd.aliases[0]}\`](${this.client.config.docs.commands}#${cmd.id})`)
						.join(', ')}`,
				);
			}
			return message.util.send(embed);
		}
		let desc = command.description.usage ?
			' ' + command.description.usage
			: '';
		const embed = new Embed()
			.setTitle(`\`${command.description.premium ? '⭐' : ''}${command.id}${desc}\``)
			.setURL(`${this.client.config.docs.commands}#${command.id}`)
			.addField(i18n.__('general.help.fields.docs.title'), i18n.__('general.help.fields.docs.click_here', `${this.client.config.docs.commands}#${command.id}`))
			.addField(i18n.__('general.help.fields.description'), command.description.content || '\u200b');

		if (command.aliases.length > 1) embed.addField(i18n.__('general.help.fields.aliases.title'), `\`${command.aliases.join('` `')}\`\n${i18n.__('general.help.fields.aliases.extra')}`, false);
		
		if (command.description.examples?.length)
			embed.addField(
				'❯ Examples',
				`\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\`\n`,
				false,
			);

		return message.util.send(embed);
	}
}

module.exports = HelpCommand;