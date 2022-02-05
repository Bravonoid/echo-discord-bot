const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");

module.exports = {
	name: "ping",
	description: "Pinging Echo",
	execute(msg) {
		const pingEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(
				`Current latency: ${Math.abs(
					Date.now() - msg.createdTimestamp
				)}ms`
			)
			.setTimestamp();

		msg.channel.send({ embeds: [pingEmbed] });
	},
};
