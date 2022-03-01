const { MessageEmbed } = require("discord.js");
const akaneko = require('akaneko');

module.exports = {
	name: "bruh",
	description: "Get a special picture",
	async execute(msg) {
		if (!msg.channel.nsfw){
			msg.channel.send('oof this channel is not safeeee')
		}
		else{
			const embed = new MessageEmbed()
			.setColor(color)
			.setTitle(`Here's a COMPLETELY RANDOM SPECIAL PICTURE for you`)
			.setImage(await akaneko.lewdNeko())

		msg.channel.send({ embeds: [embed] });
		}
	
	},
};