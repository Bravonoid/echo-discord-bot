const { MessageEmbed } = require("discord.js");
const { prefixes, color } = require("../../config.json");

module.exports = {
	name: "game",
	description: "Game list",
	execute(msg, args, commands, client, musicCommands, gameCommands) {
		const command = [];
		gameCommands.each((e) => {
			command.push([e.name, e.description]);
		});

		const gameEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${client.user.username.toUpperCase()}'S GAMING ROOM`)
			.setDescription(
				`Use \`${prefixes}\` to trigger ${client.user.username}\n\`?\` is optional`
			)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({
				text: `🎮Have fun, ${client.user.username}`,
			});
		for (let i = 0; i < command.length; i++) {
			gameEmbed.addField(`__${command[i][0]}__`, command[i][1], true);
		}

		msg.channel.send({ embeds: [gameEmbed] });
	},
};
