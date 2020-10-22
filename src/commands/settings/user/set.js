/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const {
	// Argument,
	Command,
} = require('discord-akairo');

const { Embed } = require('../../../bot');

const I18n = require('../../../locales');

class UserSetSettingsCommand extends Command {
	constructor() {
		super('user-set', {
			aliases: ['user-set'],
			category: 'hidden',
			description: {
				content: 'Set user settings',
				usage: '[settings]',
				examples: [
					'set timezone: America/New_York'
				]
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			args: [
				{
					id: 'locale',
					match: 'option',
					flag: 'locale:',
					type: 'locale', // custom
				// type: 'lowercase'
				},
				{
					id: 'timezone',
					match: 'option',
					flag: 'timezone:',
					type: 'timezone', // custom
				// type: 'lowercase'
				},
			],
		});
	}


	async exec(message, args) {
		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		const i18n = new I18n(uSettings?.locale || gSettings?.locale || 'en-GB');

		if (!uSettings)
			uSettings = await this.client.db.User.create(require('../../../models/user').defaults(message.author));

		let invalid = [],
			counter = 0;

		for (let arg in args) {
			if (!args[arg]) {
				if (message.content.includes(arg + ':'))
					invalid.push([arg, i18n.__(`settings.options.${arg}.error`) || i18n.__('settings.invalid.option')]);
				continue;
			}

			uSettings.set(arg, args[arg]);

			counter++;
		}

		uSettings.save(); // update database

		if (invalid.length > 0) {
			let docs = this.client.config.docs.settings;
			let list = '';

			for (let i in invalid)
				list += `❯ [\`${invalid[i][0]}\`](${docs}/user#${invalid[i][0]}) » ${invalid[i][1]}\n`;

			return message.util.send(
				new Embed()
					.setTitle(i18n.__('settings.user.invalid'))
					.setDescription(i18n.__('settings.invalid.description', list))
			);
		}

		let embed = new Embed();

		if (counter === 0)
			embed
				.setTitle(i18n.__('settings.server.set.no_change.title'))
				.setDescription(i18n.__('settings.server.set.no_change.description'));
		else
			embed
				.setTitle(i18n.__('settings.server.set.success.title'));
		
		for (let arg in args)
			embed.addField(i18n.__(i18n.__(`settings.options.${arg}.title`)), uSettings.get(arg) !== null ? `\`${uSettings.get(arg)}\`` : i18n.__('none'), true);

		return message.util.send(embed);

	}
}

module.exports = UserSetSettingsCommand;