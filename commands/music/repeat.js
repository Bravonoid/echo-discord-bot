const { RepeatMode } = require("discord-music-player");
const { prefixes } = require("../../config.json");

module.exports = {
	name: "repeat",
	alias: "r",
	description: `Toggle loop\n\`${prefixes}repeat #mode\``,
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}

		const command = args.slice(1, args.length).join(" ");

		// check for repeat removal
		if (!guildQueue.setRepeatMode(RepeatMode.SONG)) {
			guildQueue.setRepeatMode(RepeatMode.DISABLED);

			if (guildQueue.data) {
				if (guildQueue.data.isShuffled) {
					guildQueue.setData({
						isRepeat: false,
						isShuffled: true,
					});
				} else {
					guildQueue.setData({
						isRepeat: false,
					});
				}
			} else {
				guildQueue.setData({
					isRepeat: false,
				});
			}

			return msg.channel.send(
				`Stop repeating ${guildQueue.songs[0].name}`
			);
		}
		if (!guildQueue.setRepeatMode(RepeatMode.QUEUE)) {
			guildQueue.setRepeatMode(RepeatMode.DISABLED);

			if (guildQueue.data) {
				if (guildQueue.data.isShuffled) {
					guildQueue.setData({
						isRepeat: false,
						isShuffled: true,
					});
				} else {
					guildQueue.setData({
						isRepeat: false,
					});
				}
			} else {
				guildQueue.setData({
					isRepeat: false,
				});
			}

			return msg.channel.send("Stop repeating the queue");
		}

		let repeat = "";
		if (command.includes("single")) {
			guildQueue.setRepeatMode(RepeatMode.SONG);
			msg.channel.send(`Repeating ${guildQueue.songs[0].name}`);
			repeat = "🔂 Single";
		} else if (command.includes("queue")) {
			guildQueue.setRepeatMode(RepeatMode.QUEUE);
			msg.channel.send("Repeating the queue");
			repeat = "🔁 Queue";
		} else {
			return msg.channel.send("Repeat single or queue?");
		}

		if (guildQueue.data) {
			if (guildQueue.data.isShuffled) {
				guildQueue.setData({
					isRepeat: repeat,
					isShuffled: true,
				});
			} else {
				guildQueue.setData({
					isRepeat: repeat,
				});
			}
		} else {
			guildQueue.setData({
				isRepeat: repeat,
			});
		}
	},
};
