const { MessageEmbed } = require("discord.js");
const getRandomCat = require("../../utils/randomCat");
const { color } = require("../../config.json");

module.exports = {
	name: "cat",
	description: "Get a cat picture",
	async execute(msg) {
		const catUrl = await getRandomCat();

		const avatarEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`Here's a cat for you 😼`)
			.setURL(`${catUrl}`)
			.setImage(`${catUrl}`);

		msg.channel.send({ embeds: [avatarEmbed] });
	},
};
