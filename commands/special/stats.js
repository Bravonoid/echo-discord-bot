const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");
const { Sacred } = require("../../db/models");
const { processDataUser } = require("../../utils/dbUtils");

module.exports = {
	name: "stats",
	description: "It's privacy",
	async execute(msg) {
		let data = await processDataUser(Sacred, msg);
		if (!data) return;
		data = data.arrayMsg;

		const size = data.length > 3 ? 3 : data.length;

		let firstUser = await msg.guild.members.fetch(data[0].id);
		firstUser = firstUser.user;

		const statsEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(
				`Congratulations ${firstUser.username}!\nYou are the top ranked ~~hentai~~ enjoyer in this server!`
			)
			.setDescription(
				"Show this achievement to all of your family and friends!\nAlso here's our top 3 list"
			)
			.setThumbnail(firstUser.displayAvatarURL())
			.setFooter({
				text: "Go outside you f-",
			});

		for (let i = 0; i < size; i++) {
			let user = await msg.guild.members.fetch(data[i].id);
			user = user.user;

			statsEmbed.addField(
				`${i + 1}. ${user.username}`,
				`with ${data[i].calls} calls`
			);
		}
		msg.channel.send({ embeds: [statsEmbed] });
	},
};
