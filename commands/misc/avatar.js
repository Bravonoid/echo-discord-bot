const { MessageEmbed } = require("discord.js");
const { prefixes, color } = require("../../config.json");

module.exports = {
	name: "avatar",
	description: `Display avatar \`${prefixes}avatar @user\``,
	execute(msg) {
		const mention = msg.mentions.users.first() || msg.author;

		const avatarEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${mention.username}\`s Avatar`)
			.setAuthor({
				name: `${mention.username}#${mention.discriminator}`,
				iconURL: `https://cdn.discordapp.com/avatars/${mention.id}/${mention.avatar}.png`,
			})
			.setURL(
				`https://cdn.discordapp.com/avatars/${mention.id}/${mention.avatar}.png?size=2048`
			)
			.setImage(
				`https://cdn.discordapp.com/avatars/${mention.id}/${mention.avatar}.png?size=2048`
			);

		msg.channel.send({ embeds: [avatarEmbed] });
	},
};
