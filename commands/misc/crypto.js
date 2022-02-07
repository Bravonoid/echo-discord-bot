const { MessageEmbed } = require("discord.js");
const getCrypto = require("../../utils/misc/requestCrypto");
const { color } = require("../../config.json");

module.exports = {
	name: "crypto",
	description: "Cryptocurrency information `'crypto #symbol #currency`",
	async execute(msg, args) {
		// CHECK VALIDATOR
		if (args.length <= 1) {
			args[1] = "BTC";
			args[2] = "USD";
		} else if (args.length <= 2) {
			args[2] = "USD";
		}

		const crypto = await getCrypto(
			args[1].toUpperCase(),
			args[2].toUpperCase()
		);

		if (!crypto) {
			return msg.channel.send(
				"Please enter a valid coin symbol and/or currency notation"
			);
		}

		const cryptoEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${crypto.name.toUpperCase()} (${crypto.symbol})`)
			.setThumbnail(crypto.logo)
			.addFields(
				{
					name: "Currency",
					value: `\`\`\`${crypto.currency}\`\`\``,
					inline: true,
				},
				{
					name: "Price",
					value: `\`\`\`${crypto.price}\`\`\``,
					inline: true,
				},
				{ name: "\u200B", value: "\u200B" },
				{
					name: "% 1 Day",
					value: `\`\`\`${crypto.percent24H}\`\`\``,
					inline: true,
				},
				{
					name: "% 7 Day",
					value: `\`\`\`${crypto.percent7D}\`\`\``,
					inline: true,
				},
				{ name: "\u200B", value: "\u200B" },
				{
					name: "Volume 1 Day",
					value: `\`\`\`${crypto.volume24}\`\`\``,
					inline: true,
				},
				{
					name: "Market Cap",
					value: `\`\`\`${crypto.marketCap}\`\`\``,
					inline: true,
				}
			)
			.setTimestamp();

		msg.channel.send({ embeds: [cryptoEmbed] });
	},
};
