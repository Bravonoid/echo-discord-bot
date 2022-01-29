module.exports = {
	name: "stop",
	description: "Clear the queue",
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}
		guildQueue.stop();
		msg.channel.send(`Queue has been cleared`);
	},
};
