const { MessageEmbed } = require("discord.js");
const { prefixes, color } = require("../../config.json");
const { Utils } = require("discord-music-player");

module.exports = {
	name: "search",
	description: `Search a song\n\`${prefixes}search #title\``,
	async execute(msg, args, client, guildQueue) {
		if (!msg.member.voice.channel)
			return msg.channel.send("Please join a voice channel first");

		const voiceChannel = msg.member.voice.channel;

		// Check for another call from other channel
		if (guildQueue && guildQueue.songs[0]) {
			if (voiceChannel.id != guildQueue.connection.channel.id) {
				const exampleEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle("Beta is currently playing on other channel")
					.setDescription(
						`type \`'stop\` then \`'play\` something to move Beta`
					);

				return msg.channel.send({ embeds: [exampleEmbed] });
			}
		}

		let queue = client.player.createQueue(msg.guild.id);

		// Check for empty args
		let empty = false;
		const title = args.slice(1, args.length).join(" ");
		if (!title) {
			empty = true;
			msg.channel.send(`There's no queue yet, go 'play a song!`);
		}

		let message = null;
		if (!empty) {
			const contentEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(`Searching...`);
			message = await msg.channel.send({ embeds: [contentEmbed] });
		}

		// Search the content
		let songs = await Utils.search(title, args, queue, 5).catch((err) => {
			if (!empty) {
				msg.channel.send("Cannot find the specified content");
			}
		});

		const searchEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`RESULTS FOR ${title.toUpperCase()}`)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({
				text: "🎶Choose your song!",
			});

		if (songs) {
			songs.forEach((song, i) => {
				searchEmbed.addField(
					`${i + 1}. ${song.name}`,
					`by ${song.author} | (${song.duration})`
				);
			});
			message.edit({ embeds: [searchEmbed] });
		}

		try {
			await message.react("1️⃣");
			await message.react("2️⃣");
			await message.react("3️⃣");
			await message.react("4️⃣");
			await message.react("5️⃣");
			await message.react("❌");
		} catch (err) {
			return;
		}

		// Message await reactions sections
		const filter = (reaction, user) => {
			return (
				reaction.emoji.name === "1️⃣" ||
				reaction.emoji.name === "2️⃣" ||
				reaction.emoji.name === "3️⃣" ||
				reaction.emoji.name === "4️⃣" ||
				reaction.emoji.name === "5️⃣" ||
				reaction.emoji.name === "❌"
			);
		};

		const collector = message.createReactionCollector({
			filter,
		});

		let choosenSong = null;
		collector.on("collect", (reaction, user) => {
			if (user.id != msg.author.id) {
				return;
			}

			if (reaction.emoji.name === "1️⃣") {
				choosenSong = songs[0];
			} else if (reaction.emoji.name === "2️⃣") {
				choosenSong = songs[1];
			} else if (reaction.emoji.name === "3️⃣") {
				choosenSong = songs[2];
			} else if (reaction.emoji.name === "4️⃣") {
				choosenSong = songs[3];
			} else if (reaction.emoji.name === "5️⃣") {
				choosenSong = songs[4];
			} else if (reaction.emoji.name === "❌") {
				const cancelEmbed = new MessageEmbed().setTitle(
					"Search has been canceled"
				);
				message.edit({ embeds: [cancelEmbed] });
				empty = true;
			}

			collector.stop();
		});

		collector.on("end", async (collected) => {
			message.reactions.removeAll();

			// play the song
			await queue.join(voiceChannel);

			let song = await queue.play(choosenSong).catch(() => {
				if (!guildQueue) queue.stop();
				if (!empty) msg.channel.send("Song not found");
			});

			if (song) {
				// announce the song
				const choosenEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle(`Adding ${song.name} to the queue`)
					.setFooter({
						text: `by ${song.author}`,
					});

				message.edit({ embeds: [choosenEmbed] });

				song.setData({
					requested: msg.author.username,
				});
			}
		});
	},
};
