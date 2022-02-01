const { prefixes } = require("../../config.json");

module.exports = {
	name: "remove",
	description: `Remove a song \`${prefixes}remove #number\``,
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}

		let title = args.slice(1, args.length).join(" ");

		if (!title) {
			return msg.channel.send("Which one to remove?");
		}

		if (!isNaN(parseInt(title))) {
			title = parseInt(title);
		} else {
			return msg.channel.send(
				"Please enter a valid number from the queue"
			);
		}

		if (title > guildQueue.songs.length || title <= 0) {
			return msg.channel.send(
				"Please enter a valid number from the queue"
			);
		}

		if (title == 1) {
			msg.channel.send(`Removing ${guildQueue.songs[0].name}`);
			guildQueue.skip();
		} else {
			msg.channel.send(`Removing ${guildQueue.songs[title - 1].name}`);
			guildQueue.remove(title - 1);
		}
	},
};
