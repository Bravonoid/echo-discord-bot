const {
	MessageActionRow,
	MessageSelectMenu,
	MessageEmbed,
	MessageButton,
} = require("discord.js");
const { prefixes, color, version } = require("../../config.json");

module.exports = {
	name: "help",
	description: "Help centre",
	async execute(
		msg,
		args,
		commands,
		client,
		musicCommands,
		gameCommands,
		specialCommands
	) {
		// STARTING POINT
		// Random ID
		const menu = Math.random().toString();
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId(menu)
				.setPlaceholder("Category")
				.addOptions([
					{
						label: "Miscellaneous",
						description: "Basic commands",
						value: "general",
					},
					{
						label: "Games",
						description: "Games list",
						value: "game",
					},
					{
						label: "Music",
						description: "Music station",
						value: "music",
					},
					{
						label: "Special",
						description: "Don't you dare",
						value: "special",
					},
				])
		);

		const botName = client.user.username;

		const startingEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${botName.toUpperCase()} AT YOUR SERVICE`)
			.setDescription(`Version ${version}`)
			.addField(
				`✅ ABOUT`,
				`${botName} was developed to run most basic commands including music, minigames, etc.`
			)
			.addField(
				"🔋 STATUS",
				`As ${botName} is currently still on **development phase**, we can't guarantee that there will be no bugs wandering around. We hope to solve the problems as soon as possible.`
			)
			.setImage(
				`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=256`
			)
			.setFooter({
				text: `💚Love, ${botName}`,
			});

		await msg.channel.send({
			embeds: [startingEmbed],
			components: [row],
		});

		// Guide embeds
		const guideEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`${botName.toUpperCase()}'S COMMANDS`)
			.setDescription(`\`\`\`Use ${prefixes} to trigger ${botName}\`\`\``)
			.setThumbnail(client.user.displayAvatarURL());

		// Menus collector
		const filter = (i) => i.customId === menu;
		const collector = msg.channel.createMessageComponentCollector({
			filter,
		});

		collector.on("collect", (i) => {
			let title = "";
			let description = "";
			let footer = "";
			let safe = true;
			const command = [];

			if (i.values[0] == "general") {
				commands.each((e) => {
					command.push([e.name, e.description]);
				});

				title = `MISCELLANEOUS`;
				description = `⚙️ Here are some of the basic commands list`;
				footer = `🥂 Cheers!`;
			} else if (i.values[0] == "game") {
				gameCommands.each((e) => {
					command.push([e.name, e.description]);
				});

				title = `GAMING ROOM`;
				description = `🧩 Fun stuff to play along with your friends\n(if you have one 🤔)`;
				footer = `🎮 Have fun!`;
			} else if (i.values[0] == "music") {
				musicCommands.each((e) => {
					command.push([e.name, e.description]);
				});

				title = `MUSIC STATION`;
				description = `🎧 Enjoy your favorite song with these commands\n(There's also some shorthands for your laziness)\n\`\`\`e.g: 'p is 'play\`\`\``;
				footer = `🎵 Happy listening!`;
			} else if (i.values[0] == "special") {
				if (!msg.channel.nsfw) {
					safe = false;

					title = `RESTRICTED`;
					description = `⚠️ Go somewhere **SAFE** to explore further`;
					footer = ``;
				} else {
					specialCommands.each((e) => {
						command.push([e.name, e.description]);
					});

					title = `SPECIAL AREA`;
					description = `Please, go outside, touch grass\nthis area is **HIGHLY FORBIDDEN**`;
					footer = `😥 I warned you`;
				}
			}

			const choosenEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(title)
				.setDescription(description)
				.setFooter({ text: footer });

			if (safe) {
				for (let i = 0; i < command.length; i++) {
					choosenEmbed.addField(
						`__${command[i][0]}__`,
						command[i][1]
					);
				}
			}

			i.update({
				embeds: [guideEmbed, choosenEmbed],
				components: [row],
			});
		});
	},
};
