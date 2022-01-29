const { MessageEmbed } = require("discord.js");
const scrapeData = require("../../utils/kbbi2");
const { prefixes, color } = require("../../config.json");

module.exports = {
	name: "kbbi",
	description: `Minigame based on KBBI\n\`${prefixes}kbbi ?players\``,
	async execute(msg, args) {
		const entryEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle("MINIGAME");
		const message = await msg.channel.send({ embeds: [entryEmbed] });

		message.react("✅");

		let maxPlayers = 6;
		let title = "";
		let count = 0;
		let usernames = [];
		let userId = [];

		// check max players
		if (args.length > 1 && !isNaN(args[args.length - 1])) {
			const num = args.pop();
			maxPlayers = parseInt(num) + 1;
		}

		// REACTIONS COLLECTOR SECTIONS
		// setup reaction collector
		const filter = (reaction) => {
			return reaction.emoji.name == "✅";
		};
		const collector = message.createReactionCollector({
			filter,
			max: maxPlayers,
			dispose: true,
		});

		// each time someone remove
		collector.on("remove", (reaction, user) => {
			usernames = usernames.filter(
				(username) => username != user.username
			);
			userId = userId.filter((id) => id != user.discriminator);
			count--;

			title = `MINIGAME (${reaction.count - 1}/${maxPlayers - 1})`;

			const exampleEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(title)
				.setFooter({ text: "✅ to join\nInspired by Alita" });
			for (let i = 1; i < count; i++) {
				exampleEmbed.addField(`${i}. ${usernames[i]}`, `#${userId[i]}`);
			}
			message.edit({ embeds: [exampleEmbed] });
		});

		// each time someone react
		collector.on("collect", (reaction, user) => {
			for (username of usernames) {
				if (user.username == username) {
					return;
				}
			}

			count++;

			usernames.push(user.username);
			userId.push(user.discriminator);

			title = `MINIGAME (${reaction.count - 1}/${maxPlayers - 1})`;

			const exampleEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(title)
				.setFooter({ text: "✅ to join\nInspired by Alita" });
			for (let i = 1; i < count; i++) {
				exampleEmbed.addField(`${i}. ${usernames[i]}`, `#${userId[i]}`);
			}
			message.edit({ embeds: [exampleEmbed] });
		});

		let players = [];
		let usernameTurn = "";
		let pos = 1;
		let timer = 0;
		// on max players
		collector.on("end", () => {
			for (let i = 0; i < count; i++) {
				players.push([usernames[i], 0, 3]);
			}

			usernameTurn = players[pos][0];

			const exampleEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle("Enter a word (based on KBBI)")
				.setFooter({
					text: `${usernameTurn}'s turn`,
				});
			for (let i = 1; i < count; i++) {
				exampleEmbed.addField(
					`${i}. ${usernames[i]} :game_die:${players[i][2]}`,
					`Points : ${players[i][1]}`
				);
			}
			message.reactions.removeAll();
			message.edit({ embeds: [exampleEmbed] });
		});

		// MESSAGE COLLECTOR SECTIONS
		// setup message collector
		const msgCollector = message.channel.createMessageCollector({});

		let lastSpell = "";
		let lastWord = "";
		let countDown = "";
		const usedWords = [];
		// everytime someone send a message (answer)
		msgCollector.on("collect", async (m) => {
			// manual filter (turn)
			if (m.author.username != usernameTurn) return;

			let userDelete = "";
			if (m.content == "roll") {
				clearInterval(countDown);

				// decreasing user chances to roll
				for (player of players) {
					if (player[0] == m.author.username) {
						player[2] -= 1;
						if (player[2] < 0) {
							// assign next turn
							if (pos + 1 >= players.length) {
								pos = 1;
							} else {
								pos += 1;
							}
							usernameTurn = players[pos][0];
							userDelete = player[0];
						}
					}
				}

				players = players.filter((player) => player[0] != userDelete);

				lastWord = m.content;
				const exampleEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle("Enter a word (based on KBBI)")
					.setFooter({
						text: `${usernameTurn}'s turn\nPoints will not be added`,
					});
				for (let i = 1; i < players.length; i++) {
					exampleEmbed.addField(
						`${i}. ${players[i][0]} :game_die:${players[i][2]}`,
						`Points : ${players[i][1]}`
					);
				}
				const msgEmbed = await message.channel.send({
					embeds: [exampleEmbed],
				});

				// Roll timer sections
				timer = 10;
				countDown = setInterval(() => {
					timer -= 1;
					if (timer <= 0) {
						for (player of players) {
							if (player[0] == usernameTurn) {
								player[2] -= 1;
								if (player[2] < 0) {
									// assign next turn
									if (pos + 1 >= players.length) {
										pos = 1;
									} else {
										pos += 1;
									}
									usernameTurn = players[pos][0];
									userDelete = player[0];
								}
							}
						}
						players = players.filter(
							(player) => player[0] != userDelete
						);

						timer = 10;
					}

					const exampleEmbed = new MessageEmbed()
						.setColor(color)
						.setTitle("Enter a word (based on KBBI)")
						.setFooter({
							text: `${usernameTurn}'s turn\nPoints will not be added\n⌚${timer} seconds left`,
						});

					for (let i = 1; i < players.length; i++) {
						exampleEmbed.addField(
							`${i}. ${players[i][0]} :game_die:${players[i][2]}`,
							`Points : ${players[i][1]}`
						);
					}

					// check if there any players
					if (players.length <= 1) {
						exampleEmbed
							.setTitle(`GAME OVER`)
							.setDescription("No players left")
							.setFooter({ text: "" });
						msgEmbed.edit({ embeds: [exampleEmbed] });
						return clearTimeout(countDown);
					}

					msgEmbed.edit({ embeds: [exampleEmbed] });
				}, 1000);
			} else {
				// check for used words
				for (word of usedWords) {
					if (m.content == word) {
						return m.reply("Word has been used");
					}
				}

				// check for correct answer and last word is not roll
				if (!m.content.startsWith(lastSpell) && lastWord != "roll")
					return;

				// get data from kbbi
				const { title, subtitle, desc } = await scrapeData(m.content);

				// KBII ONLY VERSION
				if (title == "not found") return;
				if (subtitle.substring(1, subtitle.length - 1) != m.content)
					return;

				// clear interval
				clearInterval(countDown);

				// check for last letter in title is number
				let secTitle = title;
				if (!isNaN(parseInt(title[title.length - 1]))) {
					secTitle = title.slice(0, title.length - 1);
				}

				// Points system
				for (player of players) {
					if (player[0] == m.author.username) {
						if (lastWord == "roll") break;

						player[1] += secTitle.split(".").join("").length;

						// check if someone wins
						if (player[1] >= 100) {
							usernameTurn = "";
							const exampleEmbed = new MessageEmbed()
								.setColor(color)
								.setTitle(
									`${player[0].toUpperCase()} IS THE WINNER!`
								)
								.setDescription(
									`with total ${player[1]} points`
								)
								.setFooter({
									text: `Good game`,
								});
							for (let i = 1; i < players.length; i++) {
								exampleEmbed.addField(
									`${i}. ${players[i][0]} :game_die:${players[i][2]}`,
									`Points : ${players[i][1]}`
								);
							}
							return message.channel.send({
								embeds: [exampleEmbed],
							});
						}
					}
				}

				// assign last spelling
				lastSpell = secTitle.split(".").pop();

				// assign next turn
				if (pos + 1 >= players.length) {
					pos = 1;
				} else {
					pos += 1;
				}
				usernameTurn = players[pos][0];

				const exampleEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle(` ${subtitle} ${secTitle.toUpperCase()}`)
					.setDescription(`${desc}`)
					.setFooter({
						text: `${usernameTurn}'s turn\nType "roll" to reset\nEnter a word starting with "${lastSpell}"`,
					});
				for (let i = 1; i < players.length; i++) {
					exampleEmbed.addField(
						`${i}. ${players[i][0]} :game_die:${players[i][2]}`,
						`Points : ${players[i][1]}`
					);
				}
				lastWord = m.content;
				usedWords.push(m.content);
				const msgEmbed = await message.channel.send({
					embeds: [exampleEmbed],
				});

				// Roll timer sections
				timer = 15;
				countDown = setInterval(() => {
					timer -= 1;
					if (timer <= 0) {
						for (player of players) {
							if (player[0] == usernameTurn) {
								player[2] -= 1;
								if (player[2] < 0) {
									// assign next turn
									if (pos + 1 >= players.length) {
										pos = 1;
									} else {
										pos += 1;
									}
									usernameTurn = players[pos][0];
									userDelete = player[0];
								}
							}
						}
						players = players.filter(
							(player) => player[0] != userDelete
						);

						timer = 15;
					}

					const exampleEmbed = new MessageEmbed()
						.setColor(color)
						.setTitle(` ${subtitle} ${secTitle.toUpperCase()}`)
						.setDescription(`${desc}`)
						.setFooter({
							text: `${usernameTurn}'s turn\nType "roll" to reset\nEnter a word starting with "${lastSpell}"\n⌚${timer} seconds left`,
						});
					for (let i = 1; i < players.length; i++) {
						exampleEmbed.addField(
							`${i}. ${players[i][0]} :game_die:${players[i][2]}`,
							`Points : ${players[i][1]}`
						);
					}

					// check if there any players
					if (players.length <= 1) {
						exampleEmbed
							.setTitle(`GAME OVER`)
							.setDescription("No players left")
							.setFooter({ text: "" });
						msgEmbed.edit({ embeds: [exampleEmbed] });
						return clearTimeout(countDown);
					}

					msgEmbed.edit({ embeds: [exampleEmbed] });
				}, 1000);
			}
		});

		msgCollector.on("end", (collected) => {
			console.log(`Collected ${collected.size} items`);
		});
	},
};
