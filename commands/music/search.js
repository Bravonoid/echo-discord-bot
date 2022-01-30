const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
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
			.setDescription(
				`Please consider to hit \`Cancel\` before searching another song`
			)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({
				text: `🎶Choose your song!`,
			});

		const order = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("1")
					.setLabel("1")
					.setStyle("PRIMARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId("2")
					.setLabel("2")
					.setStyle("PRIMARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId("3")
					.setLabel("3")
					.setStyle("PRIMARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId("4")
					.setLabel("4")
					.setStyle("PRIMARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId("5")
					.setLabel("5")
					.setStyle("PRIMARY")
			);

		const Cancel = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId("cancel")
				.setLabel("Cancel")
				.setStyle("DANGER")
		);

		if (songs) {
			songs.forEach((song, i) => {
				searchEmbed.addField(
					`${i + 1}. ${song.name}`,
					`by ${song.author} | (${song.duration})`
				);
			});
			message.edit({
				embeds: [searchEmbed],
				components: [order, Cancel],
			});
		}

		// Buttons area
		const filter = (i) =>
			i.customId === "1" ||
			i.customId === "2" ||
			i.customId === "3" ||
			i.customId === "4" ||
			i.customId === "5" ||
			i.customId === "cancel";

		const collector = msg.channel.createMessageComponentCollector({
			filter,
			idle: 15000,
		});

		let choosenSong = null;
		collector.on("collect", async (i) => {
			if (i.user.id != msg.author.id) return;

			if (i.customId === "1") {
				choosenSong = songs[0];
			} else if (i.customId === "2") {
				choosenSong = songs[1];
			} else if (i.customId === "3") {
				choosenSong = songs[2];
			} else if (i.customId === "4") {
				choosenSong = songs[3];
			} else if (i.customId === "5") {
				choosenSong = songs[4];
			} else if (i.customId === "cancel") {
				const cancelEmbed = new MessageEmbed()
					.setTitle("Search has been canceled")
					.setColor(color);
				message.edit({ embeds: [cancelEmbed], components: [] });
				empty = true;
			}

			collector.stop();
		});

		collector.on("end", async (collected) => {
			if (choosenSong) {
				// play the song
				if (!empty) {
					await queue.join(voiceChannel);
				}

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

					message.edit({ embeds: [choosenEmbed], components: [] });

					song.setData({
						requested: msg.author.username,
					});
				}
			} else {
				const editEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle("SEARCH TIMEOUTS")
					.setDescription(`Sorry for your inconvenience`);

				message.edit({ embeds: [editEmbed], components: [] });
			}
		});
	},
};
