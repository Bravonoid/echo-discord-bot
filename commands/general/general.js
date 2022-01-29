const { MessageEmbed } = require("discord.js");
const { prefixes, color } = require("../../config.json");

module.exports = {
	name: "general",
	description: "General list",
	execute(msg, args, commands, client) {
		const command = [];
		commands.each((e) => {
			command.push([e.name, e.description]);
		});

		const generalEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${client.user.username.toUpperCase()}'S GENERAL CENTRE`)
			.setDescription(
				`Use \`${prefixes}\` to trigger ${client.user.username}\n\`?\` is optional`
			)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({
				text: `👋Have a good day, ${client.user.username}`,
			});
		for (let i = 0; i < command.length; i++) {
			generalEmbed.addField(`__${command[i][0]}__`, command[i][1], true);
		}

		msg.channel.send({ embeds: [generalEmbed] });
	},
};
