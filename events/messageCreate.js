const {
	commands,
	musicCommands,
	gameCommands,
	specialCommands,
} = require("../config/commandHandler");
const { prefixes } = require("../config.json");

module.exports = {
	name: "messageCreate",
	execute(msg, client) {
		if (msg.author.bot) return;

		// check prefix
		let args = "";
		if (msg.content.startsWith(prefixes)) {
			args = msg.content.substring(prefixes.length).split(" ");
		}
		if (!args) return;

		args[0] = args[0].toLowerCase();

		// check command
		let found = false;
		let musicFound = false;
		let gameFound = false;
		let specialFound = false;

		commands.each((e) => {
			if (e.name == args[0]) found = true;
		});
		musicCommands.each((e) => {
			// check for shorthand
			if (e.name == args[0]) {
				musicFound = true;
			} else if (e.alias == args[0]) {
				musicFound = true;
				args[0] = e.name;
			}
		});
		gameCommands.each((e) => {
			if (e.name == args[0]) gameFound = true;
		});
		specialCommands.each((e) => {
			if (e.name == args[0]) specialFound = true;
		});

		// execute command if found on each category
		if (found) {
			commands
				.get(args[0])
				.execute(
					msg,
					args,
					commands,
					client,
					musicCommands,
					gameCommands,
					specialCommands
				);
		} else if (musicFound) {
			let guildQueue = client.player.getQueue(msg.guild.id);
			musicCommands.get(args[0]).execute(msg, args, client, guildQueue);
		} else if (gameFound) {
			gameCommands.get(args[0]).execute(msg, args, client);
		} else if (specialFound) {
			// Check for safety
			if (!msg.channel.nsfw)
				return msg.channel.send("oof this channel is not safeeee");
			specialCommands.get(args[0]).execute(msg, args);
		}
	},
};
