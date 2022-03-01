const { MessageEmbed } = require("discord.js");
const akaneko = require("akaneko");
const { color } = require("../../config.json");

module.exports = {
	name: "lewd",
	description: "Get some help",
	async execute(msg) {
		const embed = new MessageEmbed()
			.setColor(color)
			.setTitle(`I beg you, get some help`)
			.setImage(await akaneko.lewdNeko());

		msg.channel.send({ embeds: [embed] });
	},
};
