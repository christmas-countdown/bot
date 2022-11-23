const {
	colour,
	haste_server
} = require('../../../config');
const Command = require('../../modules/commands/command');
const {
	CommandInteraction, // eslint-disable-line no-unused-vars
	MessageEmbed,
	Permissions
} = require('discord.js');
const fetch = require('node-fetch');
const Table = require('ascii-table');

module.exports = class SecretSantaCommand extends Command {
	constructor(client) {
		super(client, {
			description: 'Manage or participate in a Secret Santa event',
			ephemeral: true,
			guild_only: true,
			name: 'secret-santa',
			options: [
				{
					description: 'Manage the naughty list',
					name: 'blacklist',
					options: [
						{
							description: 'The member to add to the naughty list',
							name: 'add',
							required: false,
							type: Command.option_types.USER
						},
						{
							description: 'The member to remove from the naughty list',
							name: 'remove',
							required: false,
							type: Command.option_types.USER
						}
					],
					type: Command.option_types.SUB_COMMAND
				},
				{
					description: 'Check who each participant is assigned to',
					name: 'list',
					type: Command.option_types.SUB_COMMAND
				},
				{
					description: 'See who you need to give a gift to',
					name: 'show',
					type: Command.option_types.SUB_COMMAND
				}
			]
		});
	}

	/**
	 * @param {CommandInteraction} interaction
	 * @returns {Promise<void|any>}
	 */
	async execute(interaction) {
		const u_settings = await this.client.prisma.user.findUnique({ where: { id: interaction.user.id } });
		let  g_settings = interaction.guild && await this.client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const locale = u_settings?.locale ?? g_settings?.locale ?? 'en-GB';
		const i18n = this.client.i18n.getLocale(locale);

		const subcommand = interaction.options.getSubcommand(false);

		if (subcommand && subcommand !== 'show' && !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('bot.member_missing_permissions.title'))
						.setDescription(i18n('bot.member_missing_permissions.description', { permissions: '`MANAGE_GUILD`' }))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}

		const event = await this.client.prisma.secretSanta.findFirst({
			orderBy: { id: 'desc' },
			where: {
				OR: [
					{ status: 'SCHEDULED' },
					{ status: 'ACTIVE' }
				],
				guild_id: interaction.guild.id
			}
		});

		if (subcommand !== 'blacklist' && !event) {
			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setTitle(i18n('commands.secret_santa.no_event.title'))
						.setDescription(i18n('commands.secret_santa.no_event.description', { url: 'https://christmascountdown.live/discord/secret-santa' }))
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
		}

		switch (subcommand) {
		case 'blacklist': {
			// if no add and no remove: list
			const add = interaction.options.getMember('add');
			const remove = interaction.options.getMember('remove');

			if (add) {
				g_settings = await this.client.prisma.guild.update({
					data: { secret_santa_blacklist: [...g_settings.secret_santa_blacklist, add.id] },
					where: { id: interaction.guild.id }
				});

				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.secret_santa.blacklist.add.added.title'))
							.setDescription(i18n('commands.secret_santa.blacklist.add.added.description', { member: add.toString() }))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			} else if (remove) {
				const list = [...g_settings.secret_santa_blacklist];
				const index = list.findIndex(id => id === remove.id);

				if (index === -1) {
					return await interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(colour)
								.setTitle(i18n('commands.secret_santa.blacklist.remove.cannot_remove.title'))
								.setDescription(i18n('commands.secret_santa.blacklist.remove.cannot_remove.description', { member: remove.toString() }))
								.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
						]
					});
				}

				list.splice(index, 1);

				g_settings = await this.client.prisma.guild.update({
					data: { secret_santa_blacklist: list },
					where: { id: interaction.guild.id }
				});

				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.secret_santa.blacklist.remove.removed.title'))
							.setDescription(i18n('commands.secret_santa.blacklist.remove.removed.description', { member: remove.toString() }))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			} else {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.secret_santa.blacklist.list'))
							.setDescription(g_settings.secret_santa_blacklist.map(id => `<@${id}>`).join(', '))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					]
				});
			}
			// break;
		}
		case 'list': {
			const table = new Table(`${interaction.guild.name} Secret Santa participants`);
			table.setHeading('Santa', 'Recipient');

			for (const santa in event.users) table.addRow(santa, event.users[santa]);

			const key = (await (await fetch(`${haste_server}/documents`, {
				body: table,
				method: 'POST'
			}))?.json())?.key;

			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(colour)
						.setDescription(`${haste_server}/${key}`)
						.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
				]
			});
			// break;
		}
		case 'show':
		default: {
			if (event.users[interaction.user.id]) {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.secret_santa.show.show.title'))
							.setDescription(i18n('commands.secret_santa.show.show.description', { member: `<@${event.users[interaction.user.id]}>` }))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					],
					ephemeral: true // VERY IMPORTANT!
				});
			} else {
				return await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(colour)
							.setTitle(i18n('commands.secret_santa.show.none.title'))
							.setDescription(i18n('commands.secret_santa.show.none.description'))
							.setFooter(i18n('bot.footer'), this.client.user.avatarURL())
					],
					ephemeral: true
				});
			}
			// break;
		}
		}
	}
};