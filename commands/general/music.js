const { MessageEmbed } = require("discord.js");
const { prefixes, color } = require("../../config.json");

module.exports = {
	name: "music",
	description: "Music list",
	execute(msg, args, commands, client, musicCommands) {
		const command = [];
		musicCommands.each((e) => {
			command.push([e.name, e.description]);
		});

		const musicEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${client.user.username.toUpperCase()}'S MUSIC STATION`)
			.setDescription(
				`Use \`${prefixes}\` to trigger ${client.user.username}\n\`#\` is a must`
			)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({
				text: `🎵Happy listening, ${client.user.username}`,
			});
		for (let i = 0; i < command.length; i++) {
			musicEmbed.addField(`__${command[i][0]}__`, command[i][1], true);
		}

		msg.channel.send({ embeds: [musicEmbed] });
	},
};
