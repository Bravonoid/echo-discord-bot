const { MessageEmbed } = require("discord.js");
const { prefixes, color } = require("../../config.json");

module.exports = {
	name: "info",
	description: `Details Information\`${prefixes}info @user\``,
	execute(msg, args) {
		// FIX INFO AND OTHERS INFORMATION
		const mention = msg.mentions.users.first() || msg.author;
		const member = msg.guild.members.cache.get(mention.id);

		let roles = "";
		member._roles.forEach((id) => {
			roles += `${msg.guild.roles.cache.get(id)} `;
		});

		const dateJoin = new Date(member.joinedTimestamp).toUTCString();
		const dateCreate = new Date(mention.createdTimestamp).toUTCString();

		const infoEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${member.user.username.toUpperCase()}'S INFORMATION`)
			.setDescription(
				`${member.user.username}#${member.user.discriminator} ${
					member.user.bot ? "is a bot" : "is a user"
				}`
			)
			.setThumbnail(member.user.displayAvatarURL())
			.addFields({
				name: `ID`,
				value: member.user.id,
				inline: true,
			})
			.addFields({
				name: `NICKNAME`,
				value: member.nickname ? member.nickname : "None",
				inline: true,
			})
			.addFields({
				name: `ROLES`,
				value: roles ? roles : "None",
			})
			.addFields({
				name: `JOINED AT`,
				value: dateJoin,
				inline: true,
			})
			.setFooter({ text: `Has been around since ${dateCreate}` });

		msg.channel.send({ embeds: [infoEmbed] });
	},
};
