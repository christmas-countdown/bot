/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const { Command } = require('discord-akairo');
const { Embed, i18n: i18nOptions } = require('../../bot');

const { I18n } = require('i18n');
const i18n = new I18n(i18nOptions);

class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			description: {
				content: 'Evaluate JS code',
				usage: '<string>',
			},
			ownerOnly: true,
			prefix: 'x!admin.',
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					id: 'string',
					match: 'rest'
				},
			]
		});
	}

	async exec(message, args) {

		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');

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
				new Embed()
					.setTitle('Evaluation')
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.addField(':keyboard: Input', `\`\`\`js\n${clean(code).substring(0, 990)}\`\`\``)
					.addField(out_title, `\`\`\`js\n${clean(res).substring(0, 990)}\`\`\``)
					.setTimestamp()
			);

		} catch (err) {
			let out_title = `:desktop: Output ${promise?'(resolved Promise)':''} ${clean(res).length > 990?'(cut)':''}`;
			// ❯ return a promise
			return message.util.send(
				new Embed()
					.setColor('RED')
					.setTitle('Evaluation error')
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.addField(':keyboard: Input', `\`\`\`js\n${clean(code).substring(0, 990)}\`\`\``)
					.addField(out_title, `\`\`\`js\n${clean(err).substring(0, 990)}\`\`\``)

					.setTimestamp()
			);

		}
		
	}
}

module.exports = EvalCommand;