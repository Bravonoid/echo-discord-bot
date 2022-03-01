const { MessageEmbed } = require("discord.js");
const client = require("nekos.life");
const { color } = require("../../config.json");

module.exports = {
	name: "sumgif",
	description: "Touch grass",
	execute(msg) {
		const neko = new client();
		neko.nsfw.randomHentaiGif().then((neko) => {
			const embed = new MessageEmbed()
				.setTitle("Please, touch some grass")
				.setImage(neko.url)
				.setColor(color);
			msg.channel.send({ embeds: [embed] });
		});
	},
};
