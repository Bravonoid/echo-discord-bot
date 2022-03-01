const { Delete } = require("../../db/models");
const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");

module.exports = {
	name: "restore",
	description: "Restore deleted messages `'restore #amount`",
	async execute(msg, args) {
		// Check amounts
		let amounts = 1;
		if (args.length >= 1 && !isNaN(args[args.length - 1])) {
			const num = args.pop();
			amounts = parseInt(num);
		}

		const messages = await Delete.findOne({ id_server: msg.guild.id });
		if (!messages) return;
		const arrayMsg = messages.deleted_msg;

		let j = arrayMsg.length;

		if (amounts > j) amounts = j;

		const arrEmbeds = [];
		// Access each data
		for (let i = amounts - 1; i >= 0; i--) {
			// Fetch author
			let user = await msg.guild.members.fetch(arrayMsg[j - 1].author);
			user = user.user;

			// Fetch channel
			let channel = await msg.guild.channels.fetch(
				arrayMsg[j - 1].channel
			);
			channel = channel.name;

			const messageEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(arrayMsg[j - 1].content)
				.setAuthor({
					name: user.username,
					iconURL: user.displayAvatarURL(),
				})
				.setDescription(`on **${channel}**`)
				.setFooter({
					text: arrayMsg[j - 1].date,
				});

			if (arrayMsg[j - 1].attachment) {
				messageEmbed.setImage(arrayMsg[j - 1].attachment);
			}

			arrEmbeds.push(messageEmbed);
			j -= 1;
		}

		const message = await msg.channel.send({ embeds: arrEmbeds });
	},
};
