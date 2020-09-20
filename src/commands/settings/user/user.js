/**
 * @name christmascountdownbot
 * @author eartharoid <contact@eartharoid.me>
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license GPL-3.0
 */

const {
	Command,
	Flag
} = require('discord-akairo');
const { Embed, i18n: i18nOptions } = require('../../../bot');

const { stripIndents } = require('common-tags');
const { I18n } = require('i18n');
const i18n = new I18n(i18nOptions);

class UserSettingsCommand extends Command {
	constructor() {
		super('user', {
			aliases: ['user'],
			category: 'settings',
			description: {
				content: 'Modify user settings',
				usage: '<command> [args]',
				examples: [
					'set timezone: America/New_York',
					'reset'
				]
			},
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
		});
	}

	*args(message) {
		const cmd = yield {
			type: [
				['user-set', 'set'],
				['user-reset', 'reset'],
			],
			otherwise: async () => { 

				let uSettings = await message.author.settings(),
					gSettings = await message.guild?.settings();
		
				i18n.setLocale(uSettings?.locale || gSettings?.locale || 'en-GB');
		
				const prefix = gSettings?.prefix || this.client.config.prefix;

				let docs = this.client.config.docs.commands,
					moreInfo = 'Click subcommand for more information';

				return new Embed(uSettings, gSettings)
					.setTitle(i18n.__('User settings'))
					.setDescription(i18n.__(
						'The %s command has the following subcommands:\n\n%s',

						`[\`${this.id}\`](${docs}#user)`,
						stripIndents`❯ [\`set\`](${docs}#user-set "user set") » ${i18n.__(this.handler.findCommand('user-set').description.content || moreInfo)}
							❯ [\`reset\`](${docs}#user-reset "user reset") » ${i18n.__(this.handler.findCommand('user-reset').description.content || moreInfo)}`,
					))					
					.addField(i18n.__('Usage'), `\`${prefix}user set <args>\``)
					.addField(i18n.__('Help'), `\`${prefix}help user\``);
			},
		};

		return Flag.continue(cmd);
	}


}

module.exports = UserSettingsCommand;