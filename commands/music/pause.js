module.exports = {
	name: "pause",
	description: "Pause ongoing song",
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}
		guildQueue.setPaused(true);
		msg.channel.send("Paused");
	},
};
