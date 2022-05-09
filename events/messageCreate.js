const { MessageEmbed } = require("discord.js");
const {
	commands,
	musicCommands,
	gameCommands,
	specialCommands,
} = require("../config/commandHandler");
const { prefixes, color } = require("../config.json");
const { insertDataUser } = require("../utils/dbUtils");
const { Sacred } = require("../db/models");
const getAyah = require("../utils/special/randomSacred");
const getFromPost = require("../utils/automation/instagram");

module.exports = {
	name: "messageCreate",
	async execute(msg, client) {
		if (msg.author.bot) return;

		// Check if the message is from instagram
		if (msg.content.startsWith("https://www.instagram.com")) {
			const shortcode = msg.content.substring(28, msg.content.length - 1);
			const post = await getFromPost(shortcode);
			console.log(post);
		}

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
			// SPECIAL RAMADHAN
			// Fragments data
			// let { arabic, translate, surah, ayah } = await getAyah();

			// while (arabic.length > 256) {
			// 	({ arabic, translate, surah, ayah } = await getAyah());
			// }

			// const exampleEmbed = new MessageEmbed()
			// 	.setColor(color)
			// 	.setTitle(arabic)
			// 	.setDescription(translate)
			// 	.setFooter({
			// 		text: `(${surah} : ${ayah})`,
			// 	});

			// msg.channel.send({ embeds: [exampleEmbed] });

			// Save calls
			const data = {
				id: msg.author.id,
				calls: 1,
			};
			insertDataUser(msg, Sacred, data);

			// Check for safety
			if (!msg.channel.nsfw) {
				const botSend = await msg.channel.send("oof this channel is not safe");
				await setTimeout(() => {
					msg.delete();
					botSend.delete();
				}, 10000);
				return;
			}
			specialCommands.get(args[0]).execute(msg, args);
		}
	},
};
