module.exports = {
	name: "shuffle",
	description: "Shuffle the queue",
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}
		guildQueue.shuffle();
		msg.channel.send("Shuffled the queue");

		if (guildQueue.data) {
			const tempData = guildQueue.data.isRepeat;
			if (guildQueue.data.isRepeat) {
				guildQueue.setData({
					isShuffled: true,
					isRepeat: tempData,
				});
			}
		} else {
			guildQueue.setData({
				isShuffled: true,
			});
		}
	},
};
