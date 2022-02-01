const { Utils } = require("discord-music-player");
const { prefixes } = require("../../config.json");

module.exports = {
	name: "seek",
	description: `Seek forward \`${prefixes}seek #time\``,
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}

		let title = args.slice(1, args.length).join(" ");

		if (!title) {
			return msg.channel.send("Please enter a valid time seek");
		}

		if (!isNaN(parseInt(title))) {
			title = parseInt(title) * 1000;
		} else {
			return msg.channel.send("Please enter a valid time seek");
		}

		const duraMs = Utils.timeToMs(guildQueue.songs[0].duration);

		if (title > duraMs || title <= 0) {
			return msg.channel.send("Please enter a valid time seek");
		}

		guildQueue.seek(title);
	},
};
