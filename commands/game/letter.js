const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const getWordData = require("../../utils/game/dictionary");
const getRandomWord = require("../../utils/game/randomWord");
const { prefixes, color } = require("../../config.json");

module.exports = {
	name: "letter",
	description: `Words chaining game\`${prefixes}letter #players\``,
	async execute(msg, args) {
		let maxPlayers = 5;
		let title = "";
		let count = 0;
		let usernames = [];
		let userId = [];

		// check max players
		if (args.length > 1 && !isNaN(args[args.length - 1])) {
			const num = args.pop();
			maxPlayers = parseInt(num);
		}

		// Create Buttons
		const joinId = Math.random().toString();
		const join = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId(joinId)
				.setLabel("Join")
				.setStyle("SUCCESS")
		);

		const entryEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle(`LAST LETTER (0/${maxPlayers})`)
			.setDescription(
				"Chains words starting with the last letter of the latest word"
			)
			.setFooter({ text: "Come and have fun!" });

		const message = await msg.channel.send({
			embeds: [entryEmbed],
			components: [join],
		});

		// BUTTONS COLLECTOR SECTIONS
		// setup buttons collector
		const filter = (i) => {
			return i.customId === joinId;
		};

		const collector = msg.channel.createMessageComponentCollector({
			filter,
			max: maxPlayers,
			idle: 1000 * 60,
		});

		// each time someone join
		collector.on("collect", async (i) => {
			for (username of usernames) {
				if (i.user.username == username) {
					return msg.channel.send({
						content: `${i.user.username} is already in the game`,
					});
				}
			}

			count++;

			usernames.push(i.user.username);
			userId.push(i.user.discriminator);

			title = `LAST LETTER (${count}/${maxPlayers})`;

			const exampleEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(title)
				.setDescription(
					"Chains words starting with the last letter of the latest word"
				)
				.setFooter({ text: "Come and have fun!" });
			for (let i = 0; i < count; i++) {
				exampleEmbed.addField(
					`${i + 1}. ${usernames[i]}`,
					`#${userId[i]}`
				);
			}
			i.update({ embeds: [exampleEmbed], components: [join] });
		});

		// Variables
		let players = [];
		let usernameTurn = "";
		let pos = 0;
		let timer = 0;
		let lastSpell = "";
		let lastWord = "";
		let countDown = "";
		let userDelete = "";

		// on max players
		collector.on("end", async () => {
			if (usernames.length < maxPlayers) {
				const exampleEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle("LOBBY TIMEOUTS")
					.setDescription("Make a new 'letter lobby to play");

				return message.edit({ embeds: [exampleEmbed], components: [] });
			} else {
				for (let i = 0; i < count; i++) {
					players.push([usernames[i], 0, 3]);
				}

				usernameTurn = players[pos][0];

				// Get random word
				const random = await getRandomWord();
				const { title, subtitle, description } = await getWordData(
					random
				);

				lastSpell = title.substring(title.length - 1, title.length);

				const exampleEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle(`${title.toUpperCase()} ${subtitle}`)
					.setDescription(`${description}`)
					.setFooter({
						text: `${usernameTurn}'s turn\nEnter a word starting with '${lastSpell}'`,
					});
				for (let i = 0; i < count; i++) {
					exampleEmbed.addField(
						`${i + 1}. ${players[i][0]} ❤️ ${players[i][2]}`,
						`Points : ${players[i][1]}`
					);
				}
				message.edit({ embeds: [exampleEmbed], components: [] });

				// Timer sections
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
										pos = 0;
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

					if (players.length <= 1) {
						usernameTurn = "";
						const exampleEmbed = new MessageEmbed()
							.setColor(color)
							.setTitle(
								`${players[0][0].toUpperCase()} IS THE WINNER!`
							)
							.setDescription(
								`with total **${players[0][1]}** points`
							)
							.setFooter({
								text: `Good game`,
							});

						for (let i = 0; i < players.length; i++) {
							exampleEmbed.addField(
								`${i + 1}. ${players[i][0]} ❤️ ${
									players[i][2]
								}`,
								`Points : ${players[i][1]}`
							);
						}
						message.edit({
							embeds: [exampleEmbed],
						});
						return clearInterval(countDown);
					}

					const exampleEmbed = new MessageEmbed()
						.setColor(color)
						.setTitle(`${title.toUpperCase()} ${subtitle}`)
						.setDescription(`${description}`)
						.setFooter({
							text: `${usernameTurn}'s turn\nEnter a word starting with '${lastSpell}'\n⌚${timer} seconds left'`,
						});

					for (let i = 0; i < players.length; i++) {
						exampleEmbed.addField(
							`${i + 1}. ${players[i][0]} ❤️ ${players[i][2]}`,
							`Points : ${players[i][1]}`
						);
					}

					// check if there any players
					if (players.length <= 0) {
						exampleEmbed
							.setTitle(`GAME OVER`)
							.setDescription("No players left")
							.setFooter({ text: "" });
						message.edit({ embeds: [exampleEmbed] });
						return clearTimeout(countDown);
					}

					message.edit({ embeds: [exampleEmbed] });
				}, 1000);
			}
		});

		// MESSAGE COLLECTOR SECTIONS
		// setup message collector
		const msgCollector = message.channel.createMessageCollector({});

		const usedWords = [];
		// everytime someone send a message (answer)
		msgCollector.on("collect", async (m) => {
			// manual filter (turn)
			if (m.author.username != usernameTurn) return;

			// check for correct answer
			if (!m.content.startsWith(lastSpell)) return;

			// check for used words
			for (word of usedWords) {
				if (m.content == word) {
					return m.reply("Word has been used");
				}
			}

			// get data of word
			const { title, subtitle, description } = await getWordData(
				m.content
			);

			if (!title) {
				return;
			}

			// clear interval
			clearInterval(countDown);

			// Points system
			for (player of players) {
				if (player[0] == m.author.username) {
					player[1] += title.length;

					// check if someone wins
					if (player[1] >= 100) {
						usernameTurn = "";
						const exampleEmbed = new MessageEmbed()
							.setColor(color)
							.setTitle(
								`${player[0].toUpperCase()} IS THE WINNER!`
							)
							.setDescription(
								`with total **${player[1]}** points`
							)
							.setFooter({
								text: `👏 Good game`,
							});

						for (let i = 0; i < players.length; i++) {
							exampleEmbed.addField(
								`${i + 1}. ${players[i][0]} ❤️ ${
									players[i][2]
								}`,
								`Points : ${players[i][1]}`
							);
						}
						return m.channel.send({
							embeds: [exampleEmbed],
						});
					}
				}
			}
			// assign last spelling
			lastSpell = title.substring(title.length - 1, title.length);

			// assign next turn
			if (pos + 1 >= players.length) {
				pos = 0;
			} else {
				pos += 1;
			}
			usernameTurn = players[pos][0];

			// Save last word
			lastWord = title;
			usedWords.push(lastWord);

			const exampleEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(`${title.toUpperCase()} ${subtitle}`)
				.setDescription(`${description}`)
				.setFooter({
					text: `${usernameTurn}'s turn\nEnter a word starting with '${lastSpell}'`,
				});
			for (let i = 0; i < count; i++) {
				exampleEmbed.addField(
					`${i + 1}. ${players[i][0]} ❤️ ${players[i][2]}`,
					`Points : ${players[i][1]}`
				);
			}
			const message = await m.channel.send({
				embeds: [exampleEmbed],
			});

			// Timer sections
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
									pos = 0;
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

				if (players.length <= 1) {
					usernameTurn = "";
					const exampleEmbed = new MessageEmbed()
						.setColor(color)
						.setTitle(
							`${players[0][0].toUpperCase()} IS THE WINNER!`
						)
						.setDescription(
							`with total **${players[0][1]}** points`
						)
						.setFooter({
							text: `Good game`,
						});

					for (let i = 0; i < players.length; i++) {
						exampleEmbed.addField(
							`${i + 1}. ${players[i][0]} ❤️ ${players[i][2]}`,
							`Points : ${players[i][1]}`
						);
					}
					message.edit({
						embeds: [exampleEmbed],
					});
					return clearInterval(countDown);
				}

				const exampleEmbed = new MessageEmbed()
					.setColor(color)
					.setTitle(`${title.toUpperCase()} ${subtitle}`)
					.setDescription(`${description}`)
					.setFooter({
						text: `${usernameTurn}'s turn\nEnter a word starting with '${lastSpell}'\n⌚${timer} seconds left'`,
					});

				for (let i = 0; i < players.length; i++) {
					exampleEmbed.addField(
						`${i + 1}. ${players[i][0]} ❤️ ${players[i][2]}`,
						`Points : ${players[i][1]}`
					);
				}

				// check if there any players
				if (players.length <= 0) {
					exampleEmbed
						.setTitle(`GAME OVER`)
						.setDescription("No players left")
						.setFooter({ text: "" });
					message.edit({ embeds: [exampleEmbed] });
					return clearTimeout(countDown);
				}

				message.edit({ embeds: [exampleEmbed] });
			}, 1000);
		});
	},
};
