const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");
const cat = require("../general/cat");

module.exports = {
	name: "queue",
	alias: "q",
	description: "Songs list",
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue || guildQueue.songs.length == 0) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}

		let empty = false;
		if (guildQueue.data) {
			if (guildQueue.data.queue == "active") {
				const contentEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle(`Someone is currently shows the queue`)
					.setDescription("Please hit the `Cancel` button first")
					.setFooter({
						text: "We hope to solve the problem as soon as possible.",
					});
				return msg.channel.send({ embeds: [contentEmbed] });
			}
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

		const navigate = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("previous")
					.setLabel("Previous")
					.setStyle("PRIMARY")
					.setDisabled(true)
			)
			.addComponents(
				new MessageButton()
					.setCustomId("next")
					.setLabel("Next")
					.setStyle("PRIMARY")
					.setDisabled(true)
			)
			.addComponents(
				new MessageButton()
					.setCustomId("cancel")
					.setLabel("Cancel")
					.setStyle("DANGER")
			);

		if (songs.length > 5) {
			navigate.components[1].setDisabled(false);
		}

		const message = await msg.channel.send({
			embeds: [sendEmbed],
			components: [navigate],
		});

		const temp = [];
		if (guildQueue.data) {
			for (const data in guildQueue.data) {
				temp.push([data, guildQueue.data[data]]);
			}
		}

		if (!empty) {
			guildQueue.setData({
				queue: "active",
			});
		}

		for (let i = 0; i < temp.length; i++) {
			guildQueue.data[temp[i][0]] = temp[i][1];
		}

		// Buttons area
		const filter = (i) =>
			i.customId === "previous" ||
			i.customId === "next" ||
			i.customId === "cancel";

		const collector = msg.channel.createMessageComponentCollector({
			filter,
			idle: 15000,
		});

		collector.on("collect", async (i) => {
			guildQueue.setData({
				queue: "off",
			});

			if (i.customId === "next") {
				firstIndex += 5;
				lastIndex += 5;
				if (lastIndex >= guildQueue.songs.length) {
					lastIndex = guildQueue.songs.length;
				}
			} else if (i.customId === "previous") {
				firstIndex -= 5;
				if (lastIndex == guildQueue.songs.length) {
					lastIndex -= lastIndex % 5;
				} else {
					lastIndex -= 5;
				}
			} else if (i.customId === "cancel") {
				const cancelEmbed = new MessageEmbed()
					.setTitle("Queue has been canceled")
					.setColor(color);
				return message.edit({ embeds: [cancelEmbed], components: [] });
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

			guildQueue.setData({
				queue: "",
			});
		});

		collector.on("end", (collected) => {
			const editEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle("QUEUE TIMEOUTS")
				.setDescription(`Sorry for your inconvenience`);
			message.edit({ embeds: [editEmbed], components: [] });

			guildQueue.setData({
				queue: "off",
			});
		});
	},
};
