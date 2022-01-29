const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");

module.exports = {
	name: "playing",
	description: "Song information",
	async execute(msg, args, client, guildQueue) {
		if (!guildQueue) {
			return msg.channel.send("There's no queue yet, go 'play a song!");
		}

		const exampleEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`Playing ${guildQueue.nowPlaying.name}`)
			.setURL(guildQueue.nowPlaying.url)
			.setAuthor({ name: `${guildQueue.nowPlaying.author}` })
			.setDescription(`🎵 ${guildQueue.nowPlaying.duration}`)
			// .setThumbnail(guildQueue.nowPlaying.thumbnail)
			.setImage(guildQueue.nowPlaying.thumbnail)
			.setFooter({
				text: `Requested by ${guildQueue.nowPlaying.data.requested}`,
			});

		const message = await msg.channel.send({ embeds: [exampleEmbed] });
		const progress = setInterval(() => {
			try {
				const ongoingBar = guildQueue.createProgressBar();
				exampleEmbed.setDescription(`🎵 ${ongoingBar.times}`);

				message.edit({ embeds: [exampleEmbed] });
			} catch (err) {
				clearTimeout(progress);
				return;
			}
		}, 1000);
	},
};
