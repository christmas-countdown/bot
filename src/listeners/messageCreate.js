const { Message } = require('discord.js'); // eslint-disable-line no-unused-vars
const EventListener = require('../modules/listeners/listener');

module.exports = class MessageCreateEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'messageCreate' });
	}

	/**
	 * @param {Message} message
	 */
	async execute(message) {
		if (message.author.bot) return;

		const is_owner = message.author.id === process.env.OWNER;

		if (is_owner && message.content.startsWith('x!sync')) {
			const guild = message.content.split(' ')[1];
			if (guild) this.client.commands.publish(guild);
			else this.client.commands.publish();
			message.reply('ok');
		} else if (is_owner && message.content.startsWith('x!premium')) {
			const guild = message.content.split(' ')[1] ?? message.guild.id;
			const row = await this.client.prisma.guild.findUnique({ where: { id: guild } });
			if (!row) return message.reply('no guild');
			await this.client.prisma.guild.update({
				data: { premium: !row.premium },
				where: { id: guild }
			});
			message.reply(row.premium ? 'disabled' : 'enabled');
		} else {
			const regex = new RegExp(`^(x!)|(<@!?${this.client.user.id}>)`, 'i');
			if (!regex.test(message.content) && message.channel.type !== 'DM') return;

			this.client.log.info(`Received message from ${message.author.tag}`);

			const u_settings = await this.client.prisma.user.findUnique({ where: { id: message.author.id } });
			const g_settings = message.guild && await this.client.prisma.guild.findUnique({ where: { id: message.guild.id } });
			const i18n = this.client.i18n.getLocale(u_settings?.locale ?? g_settings?.locale);

			message.reply(i18n('bot.migrate'))
				.catch(() => message.channel.send(i18n('bot.migrate'))
					.catch(error => this.client.log.error(error)));

		}
	}
};