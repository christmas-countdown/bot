const EventListener = require('../modules/listeners/listener');

module.exports = class ErrorEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'voiceStateUpdate' });
	}

	async execute(past, present) {
		const g_settings = await this.client.prisma.guild.findUnique({ where: { id: past.guild.id } });
		if (!g_settings?.voice_channel) return;

		let channelOfInterest = past.guild.members.me?.voice?.channel;

		if (!channelOfInterest && present.channel.id === g_settings.voice_channel) {
			channelOfInterest = present.channel;
			return this.client.voiceSocket?.send(
				JSON.stringify({
					channelId: channelOfInterest.id,
					guildId: channelOfInterest.guild.id,
					signal: 'join'
				})
			);
		}

		if (!channelOfInterest) return;

		if (
			past.channelId === channelOfInterest.id ||
			present.channelId === channelOfInterest.id
		) {
			const active = channelOfInterest.members.some(
				member =>
					member.user.bot === false &&
					member.voice.dead !== true &&
					member.voice.selfDeaf !== true
			);

			this.client.voiceSocket?.send(
				JSON.stringify({
					channelId: channelOfInterest.id,
					guildId: channelOfInterest.guild.id,
					signal: active ? 'resume' : 'suspend'
				})
			);
		}
	}
};
