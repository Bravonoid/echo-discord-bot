const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");

module.exports = {
	name: "queue",
	alias: "q",
	description: "Songs list inside the queue",
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue || guildQueue.songs.length == 0) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}

		// Storing previous data
		const temp = [];
		if (guildQueue.data) {
			for (const data in guildQueue.data) {
				temp.push([data, guildQueue.data[data]]);
			}
		}

		for (let i = 0; i < temp.length; i++) {
			guildQueue.data[temp[i][0]] = temp[i][1];
		}

		let status = [];
		for (const data in guildQueue.data) {
			status.push(guildQueue.data[data]);
		}

		status = status.join(" | ");

		// Random ID
		const previous = Math.random().toString();
		const next = Math.random().toString();

		const navigate = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(previous)
					.setLabel("Previous")
					.setStyle("PRIMARY")
					.setDisabled(true)
			)
			.addComponents(
				new MessageButton()
					.setCustomId(next)
					.setLabel("Next")
					.setStyle("PRIMARY")
					.setDisabled(true)
			);
		const songs = guildQueue.songs;
		let showSongs = songs;
		let firstIndex = 0;
		let lastIndex = 5;
		if (songs.length > 5) {
			showSongs = songs.slice(firstIndex, lastIndex);
			navigate.components[1].setDisabled(false);
		}

		const sendEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle("QUEUE")
			.setDescription(`Total ${guildQueue.songs.length} songs`)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({
				text: `${status}\n🎶Enjoy!`,
			});

		showSongs.forEach((song, i) => {
			sendEmbed.addField(
				`${i + 1}. ${song.name}`,
				`(${song.duration}) | Requested by ${song.data.requested}`
			);
		});

		const message = await msg.channel.send({
			embeds: [sendEmbed],
			components: [navigate],
		});

		// Buttons area
		const filter = (i) => i.customId === previous || i.customId === next;

		const collector = msg.channel.createMessageComponentCollector({
			filter,
		});

		collector.on("collect", async (i) => {
			if (i.customId === next) {
				firstIndex += 5;
				lastIndex += 5;
				if (lastIndex >= guildQueue.songs.length) {
					lastIndex = guildQueue.songs.length;
				}
			} else if (i.customId === previous) {
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
					text: `${status}\n🎶Enjoy!`,
				});

			showSongs = songs.slice(firstIndex, lastIndex);
			showSongs.forEach((song, i) => {
				editEmbed.addField(
					`${i + 1 + firstIndex}. ${song.name}`,
					`(${song.duration}) | Requested by ${song.data.requested}`
				);
			});

			if (lastIndex == guildQueue.songs.length) {
				navigate.components[0].setDisabled(false);
				navigate.components[1].setDisabled(true);
			} else if (firstIndex == 0) {
				navigate.components[0].setDisabled(true);
				navigate.components[1].setDisabled(false);
			} else {
				navigate.components[0].setDisabled(false);
				navigate.components[1].setDisabled(false);
			}

			i.update({ embeds: [editEmbed], components: [navigate] });
		});
	},
};
