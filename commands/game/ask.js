const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");

module.exports = {
	name: "ask",
	description: "Ask anything",
	async execute(msg) {
		const pingEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`Ask anything for 1 minute`)
			.setDescription(
				`The answer is either YES or NO\nDon't forget to put \`?\` at the end`
			);

		const message = await msg.channel.send({ embeds: [pingEmbed] });

		// Timer section
		timer = 60;
		const timeout = setInterval(() => {
			pingEmbed.setFooter({ text: `⌚${timer} seconds left` });
			timer -= 1;
			message.edit({ embeds: [pingEmbed] });
			if (timer < 0) {
				clearInterval(timeout);
			}
		}, 1000);

		// Message collector sections
		const filter = (m) => m.content.endsWith("?");
		const collector = msg.channel.createMessageCollector({
			filter,
			time: 60000,
		});

		collector.on("collect", (m) => {
			const random = Math.random();
			if (random < 0.5) {
				m.reply("yes");
			} else {
				m.reply("no");
			}
		});

		collector.on("end", (collected) => {
			const endEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle("Times up!")
				.setDescription("Thanks for asking");
			message.channel.send({ embeds: [endEmbed] });
		});
	},
};
