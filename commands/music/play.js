const { MessageEmbed } = require("discord.js");
const { prefixes, color } = require("../../config.json");

module.exports = {
	name: "play",
	alias: "p",
	description: `Play something\n\`${prefixes}play #content\``,
	async execute(msg, args, client, guildQueue) {
		if (!msg.member.voice.channel)
			return msg.channel.send("Please join a voice channel first");

		const voiceChannel = msg.member.voice.channel;

		// Check for another call from other channel
		if (guildQueue) {
			if (guildQueue.connection) {
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
		}

		let queue = client.player.createQueue(msg.guild.id);

		// paused checker
		let paused = true;
		if (guildQueue && guildQueue.isPlaying) {
			if (guildQueue.setPaused(true)) {
				guildQueue.setPaused(false);
				paused = false;
			}
		}

		// check for empty args
		let empty = false;
		const title = args.slice(1, args.length).join(" ");
		if (!title) {
			if (!paused) {
				return msg.channel.send("Playing");
			}
			empty = true;
			msg.channel.send(`There's no queue yet, go 'play a song!`);
		}

		// playlist checker
		let contentTitle = "";
		let playlist = false;
		if (title.includes("playlist")) {
			playlist = true;
			contentTitle = "playlist";
		} else {
			contentTitle = "song";
		}

		let message = null;
		if (!empty) {
			const contentEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(`Loading ${contentTitle} to the queue...`);
			message = await msg.channel.send({ embeds: [contentEmbed] });

			await queue.join(voiceChannel);
		}

		// play the song

		if (playlist) {
			const choosenEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(`Adding playlist to the queue`);

			message.edit({ embeds: [choosenEmbed] });

			let song = await queue.playlist(title).catch(() => {
				if (!guildQueue) queue.stop();
				if (!empty) msg.channel.send("Playlist not found");
			});

			song.queue.songs.forEach((song) => {
				song.setData({
					requested: msg.author.username,
				});
			});
		} else {
			let song = await queue.play(title).catch(() => {
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
		}
	},
};
