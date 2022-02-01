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

		const temp = [];
		if (guildQueue.data) {
			for (const data in guildQueue.data) {
				if (data == "repeat") continue;
				temp.push([data, guildQueue.data[data]]);
			}
		}

		let repeat = null;
		// check for repeat removal
		if (!guildQueue.setRepeatMode(RepeatMode.SONG)) {
			guildQueue.setRepeatMode(RepeatMode.DISABLED);

			msg.channel.send(`Stop repeating ${guildQueue.songs[0].name}`);
		} else {
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
		}

		guildQueue.setData({});

		if (repeat) {
			guildQueue.setData({
				repeat,
			});
		}

		for (let i = 0; i < temp.length; i++) {
			guildQueue.data[temp[i][0]] = temp[i][1];
		}
	},
};
