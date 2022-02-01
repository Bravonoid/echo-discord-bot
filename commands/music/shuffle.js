module.exports = {
	name: "shuffle",
	description: "Shuffle the queue",
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}
		guildQueue.shuffle();
		msg.channel.send("Shuffled the queue");

		const temp = [];
		if (guildQueue.data) {
			for (const data in guildQueue.data) {
				temp.push([data, guildQueue.data[data]]);
			}
		}

		guildQueue.setData({
			shuffled: "🔀 Shuffled",
		});

		for (let i = 0; i < temp.length; i++) {
			guildQueue.data[temp[i][0]] = temp[i][1];
		}
	},
};
