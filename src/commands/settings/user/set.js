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

const {
	Embed
} = require('../../../bot');

const {
	I18n
} = require('i18n');
const i18n = new I18n(require('../../../bot').i18n);

class UserSetSettingsCommand extends Command {
	constructor() {
		super('user-set', {
			aliases: ['user-set'],
			description: 'Set user settings',
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

		this.examples = [
			'user set timezone: America/New_York'
		];
	}


	async exec(message, args) {
		let uSettings = await message.author.settings(),
			gSettings = await message.guild?.settings();
		
		i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');

		if (!uSettings)
			uSettings = await this.client.db.User.create(require('../../../models/user').defaults(message.author));

		let invalid = [],
			counter = 0;

		for (let arg in args) {
			if (!args[arg]) {
				if (message.content.includes(arg + ':'))
					invalid.push([arg, 'Invalid input (see docs)']);
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
				list += `❯ [\`${invalid[i][0]}\`](${docs}/user#${invalid[i][0]}) » ${i18n.__(invalid[i][1])}\n`;

			message.util.send(
				new Embed()
					.setTitle(':x: User settings')
					.setDescription(i18n.__('There were some issues with the provided options:\n%s\nClick on the blue setting name to see the documentation.',
						list
					))
			);
		}

		const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
		let embed = new Embed();

		if (counter === 0 && invalid.length === 0)
			embed
				.setTitle(i18n.__('User settings'))
				.setDescription(i18n.__('Nothing changed.'));
		else
			embed
				.setTitle(i18n.__(':white_check_mark: User settings updated'));
		
		for (let arg in args)
			embed.addField(i18n.__(capitalise(arg)), uSettings.get(arg) !== null ? `\`${uSettings.get(arg)}\`` : i18n.__('none'), true);

		return message.util.send(embed);

	}
}

module.exports = UserSetSettingsCommand;