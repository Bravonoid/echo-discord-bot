const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");

module.exports = {
	name: "invite",
	description: `Invite Echo to your desired server`,
	execute(msg) {
		const pingEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle("Invite Me!")
			.setURL(
				"https://discord.com/api/oauth2/authorize?client_id=930670709695463464&permissions=8&scope=bot%20applications.commands"
			);

		msg.channel.send({ embeds: [pingEmbed] });
	},
};
