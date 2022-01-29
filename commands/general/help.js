const { MessageEmbed } = require("discord.js");
const { prefixes, color } = require("../../config.json");

module.exports = {
	name: "help",
	description: "Help centre",
	execute(
		msg,
		args,
		commands,
		client,
		musicCommands,
		gameCommands,
		nodesFiles
	) {
		// Nodes for the titles
		const commandName = [];
		nodesFiles.forEach((node) => {
			commandName.push(node);
		});

		// Commands for the descriptions
		const commandDesc = [];
		let temp = "";
		commands.each((e) => {
			temp += `\`${e.name}\` `;
		});
		commandDesc.push(temp);

		temp = "";
		gameCommands.each((e) => {
			temp += `\`${e.name}\` `;
		});
		commandDesc.push(temp);

		temp = "";
		musicCommands.each((e) => {
			temp += `\`${e.name}\` `;
		});
		commandDesc.push(temp);

		let helpEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${client.user.username.toUpperCase()} AT YOUR SERVICE`)
			.setDescription(
				`Use \`${prefixes}\` to trigger ${client.user.username}`
			)
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({
				text: `💙Love, ${client.user.username}`,
			});
		for (let i = 0; i < commandName.length; i++) {
			const command = commandName[i];
			const desc = commandDesc[i];
			helpEmbed.addField(`__${command.toUpperCase()}__`, desc);
		}

		msg.channel.send({ embeds: [helpEmbed] });
	},
};
