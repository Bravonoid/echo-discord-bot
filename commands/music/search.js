const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { prefixes, color } = require("../../config.json");
const { Utils } = require("discord-music-player");

module.exports = {
	name: "search",
	description: `Search a song \`${prefixes}search #content\``,
	async execute(msg, args, client, guildQueue) {
		if (!msg.member.voice.channel)
			return msg.channel.send("Please join a voice channel first");

		const voiceChannel = msg.member.voice.channel;
		let empty = false;

		// Check for another call from other channel
		if (guildQueue && guildQueue.songs[0]) {
			if (voiceChannel.id != guildQueue.connection.channel.id) {
				const exampleEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle(
						`${client.user.username} is currently playing on other channel`
					)
					.setDescription(
						`type \`'stop\` then \`'play\` something to move ${client.user.username}`
					);

				msg.channel.send({ embeds: [exampleEmbed] });
			}
			empty = true;
		}

		let queue = client.player.createQueue(msg.guild.id);

		// Check for empty args
		const title = args.slice(1, args.length).join(" ");
		if (!title) {
			msg.channel.send(`What do you want to search?`);
			return;
		}

		const contentEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`Searching...`);
		const message = await msg.channel.send({ embeds: [contentEmbed] });

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
				text: `🎶Choose your song!`,
			});

		// Random ID
		const one = Math.random().toString();
		const two = Math.random().toString();
		const three = Math.random().toString();
		const four = Math.random().toString();
		const five = Math.random().toString();
		const cancel = Math.random().toString();

		const order = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(one)
					.setLabel("1")
					.setStyle("PRIMARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(two)
					.setLabel("2")
					.setStyle("PRIMARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(three)
					.setLabel("3")
					.setStyle("PRIMARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(four)
					.setLabel("4")
					.setStyle("PRIMARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(five)
					.setLabel("5")
					.setStyle("PRIMARY")
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
				components: [order],
			});
		}

		// Buttons area
		const filter = (i) =>
			i.customId === one ||
			i.customId === two ||
			i.customId === three ||
			i.customId === four ||
			i.customId === five ||
			i.customId === cancel;

		const collector = msg.channel.createMessageComponentCollector({
			filter,
			max: 1,
		});

		let choosenSong = null;
		collector.on("end", async (i) => {
			i = i.first();

			if (i.customId === one) {
				choosenSong = songs[0];
			} else if (i.customId === two) {
				choosenSong = songs[1];
			} else if (i.customId === three) {
				choosenSong = songs[2];
			} else if (i.customId === four) {
				choosenSong = songs[3];
			} else if (i.customId === five) {
				choosenSong = songs[4];
			}

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
			}
		});
	},
};
