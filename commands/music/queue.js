const { first, last } = require("cheerio/lib/api/traversing");
const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");

module.exports = {
	name: "queue",
	alias: "q",
	description: "Songs list",
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue || guildQueue.songs.length == 0) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}

		let shuffled = "";
		if (guildQueue.data) {
			if (guildQueue.data.isShuffled) {
				shuffled += "🔀 Shuffled | ";
			}

			if (guildQueue.data.isRepeat) {
				shuffled += `${guildQueue.data.isRepeat} |`;
			}
		}

		const songs = guildQueue.songs;
		let showSongs = songs;
		let firstIndex = 0;
		let lastIndex = 5;
		if (songs.length > 5) {
			showSongs = songs.slice(firstIndex, lastIndex);
		}

		// FIX FOR HUGE SONGS LIST
		const sendEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle("QUEUE")
			.setDescription(`Total ${guildQueue.songs.length} songs`)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({
				text: `${shuffled}\n🎶Enjoy!`,
			});

		showSongs.forEach((song, i) => {
			sendEmbed.addField(
				`${i + 1}. ${song.name}`,
				`(${song.duration}) | Requested by ${song.data.requested}`
			);
		});

		const message = await msg.channel.send({ embeds: [sendEmbed] });

		if (songs.length > 5) {
			await message.react("➡️");
		}

		// Message await reactions sections
		const filter = (reaction, user) => {
			return reaction.emoji.name === "➡️" || reaction.emoji.name === "⬅️";
		};

		const collector = message.createReactionCollector({
			filter,
		});

		collector.on("collect", async (reaction, user) => {
			if (user.id == client.user.id) return;

			message.reactions.removeAll();

			if (reaction.emoji.name === "➡️") {
				firstIndex += 5;
				lastIndex += 5;
				if (lastIndex >= guildQueue.songs.length) {
					lastIndex = guildQueue.songs.length;
				}
			} else if (reaction.emoji.name === "⬅️") {
				firstIndex -= 5;
				if (lastIndex == guildQueue.songs.length) {
					lastIndex -= lastIndex % 5;
				} else {
					lastIndex -= 5;
				}
			}

			const editEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle("QUEUE")
				.setDescription(`Total ${guildQueue.songs.length} songs`)
				.setThumbnail(client.user.displayAvatarURL())
				.setFooter({
					text: `${shuffled}\n🎶Enjoy!`,
				});

			showSongs = songs.slice(firstIndex, lastIndex);
			showSongs.forEach((song, i) => {
				editEmbed.addField(
					`${i + 1 + firstIndex}. ${song.name}`,
					`(${song.duration}) | Requested by ${song.data.requested}`
				);
			});

			message.edit({ embeds: [editEmbed] });

			if (lastIndex == guildQueue.songs.length) {
				await message.react("⬅️");
			} else if (firstIndex == 0) {
				await message.react("➡️");
			} else {
				try {
					await message.react("⬅️");
					await message.react("➡️");
				} catch (err) {
					return;
				}
			}
		});

		collector.on("end", async (collected) => {
			message.reactions.removeAll();
		});
	},
};
