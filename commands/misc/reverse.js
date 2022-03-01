const { Update } = require("../../db/models");
const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");
const { processData } = require("../../utils/dbUtils");

module.exports = {
	name: "reverse",
	description: "Reverse edited messages `'reverse #amount`",
	async execute(msg, args) {
		// FIX ON REVERSE MESSAGE
		const data = await processData(args, Update, msg);
		if (!data) return;

		const amounts = data.amounts;
		const arrayMsg = data.arrayMsg;
		let j = data.j;

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
				.setTitle(
					`Edited "${arrayMsg[j - 1].old}" into "${
						arrayMsg[j - 1].new
					}"`
				)
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
