module.exports = {
	name: "skip",
	alias: "s",
	description: "Skip ongoing song",
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}
		guildQueue.skip();
		msg.channel.send(`Skipping ${guildQueue.songs[0].name}`);
	},
};
