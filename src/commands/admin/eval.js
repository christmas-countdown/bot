/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger(); // required for i18n
const { I18n } = require('i18n');
const i18n = new I18n(require('../../bot').i18n);

class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			ownerOnly: true,
			prefix: 'x!admin.',
			args: [
				{
					id: 'string',
					match: 'rest'
				},
			]
		});
	}

	async exec(message, args) {

		i18n.setLocale((await message.guild.settings()).locale || 'en-GB');

		const clean = text => {
			if (typeof (text) === 'string')
				return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
			else
				return String(text);
		};

		const code = args.string;
		let res, promise;

		try {
			res = eval(code);

			if (res instanceof Promise)
				res = await res, promise = true;

			if (typeof res !== 'string')
				res = require('util').inspect(res);

			let out_title = `:desktop: Output ${promise?'(resolved Promise)':''} ${clean(res).length > 990?'(cut)':''}`;
			// ❯ return a promise
			return message.util.send(
				new MessageEmbed()
					.setColor(this.client.config.colour)
					.setTitle('Evaluation')
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.addField(':keyboard: Input', `\`\`\`js\n${clean(code).substring(0, 990)}\`\`\``)
					.addField(out_title, `\`\`\`js\n${clean(res).substring(0, 990)}\`\`\``)
					.setFooter(i18n.__(this.client.const.footer), this.client.user.displayAvatarURL())
					.setTimestamp()
			);

		} catch (err) {
			let out_title = `:desktop: Output ${promise?'(resolved Promise)':''} ${clean(res).length > 990?'(cut)':''}`;
			// ❯ return a promise
			return message.util.send(
				new MessageEmbed()
					.setColor('RED')
					.setTitle('Evaluation error')
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.addField(':keyboard: Input', `\`\`\`js\n${clean(code).substring(0, 990)}\`\`\``)
					.addField(out_title, `\`\`\`js\n${clean(err).substring(0, 990)}\`\`\``)
					.setFooter(i18n.__(this.client.const.footer), this.client.user.displayAvatarURL())
					.setTimestamp()
			);

		}
		
	}
}

module.exports = EvalCommand;