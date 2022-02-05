const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { color } = require("../../config.json");

module.exports = {
	name: "tictactoe",
	description: "Tic-Tac-Toe",
	async execute(msg, args, client) {
		// Starting Embeds
		const exampleEmbed = new MessageEmbed()
			.setColor(color)
			.setTitle("TIC-TAC-TOE")
			.setFooter({
				text: "💢 Choose your opponent!",
			});

		// Opponents Buttons
		const opPlayerId = Math.random().toString();
		const opBotId = Math.random().toString();
		const opponents = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(opPlayerId)
					.setLabel("Player")
					.setStyle("PRIMARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(opBotId)
					.setLabel(client.user.username)
					.setStyle("SECONDARY")
			);

		const message = await msg.channel.send({
			embeds: [exampleEmbed],
			components: [opponents],
		});

		// Select Opponent Respond
		const filter = (i) =>
			(i.customId === opPlayerId || i.customId === opBotId) &&
			i.user.id === msg.author.id;

		const collector = message.channel.createMessageComponentCollector({
			filter,
			max: 1,
		});

		// Opponents variable
		let bot = false;
		let title;
		let description;
		let footer;

		// Player join button
		const playerJoinId = Math.random().toString();
		const playerJoin = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId(playerJoinId)
				.setLabel("Join")
				.setStyle("SUCCESS")
		);

		// Ready button
		const readyId = Math.random().toString();
		const ready = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId(readyId)
				.setLabel("Start")
				.setStyle("SUCCESS")
		);

		// TicTacToe Buttons
		const numberId = [];
		for (let i = 0; i < 9; i++) {
			numberId.push(Math.random().toString());
		}
		const row1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(numberId[0])
					.setLabel(" ")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(numberId[1])
					.setLabel(" ")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(numberId[2])
					.setLabel(" ")
					.setStyle("SECONDARY")
			);
		const row2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(numberId[3])
					.setLabel(" ")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(numberId[4])
					.setLabel(" ")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(numberId[5])
					.setLabel(" ")
					.setStyle("SECONDARY")
			);
		const row3 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(numberId[6])
					.setLabel(" ")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(numberId[7])
					.setLabel(" ")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new MessageButton()
					.setCustomId(numberId[8])
					.setLabel(" ")
					.setStyle("SECONDARY")
			);

		const player1 = [];
		const player2 = [];
		let buttons = [];
		collector.on("collect", async (i) => {
			player1.push([msg.author.username, "❌"]);

			// CONTINUE ON PLAYER
			if (i.customId === opPlayerId) {
				bot = false;
				title = `${player1[0][0].toUpperCase()} VS SOMEONE`;
				description = `Ask your friend to join your session!`;
				footer = `(I really hope you do have one 🧐)`;
				buttons = [playerJoin];
			} else if (i.customId === opBotId) {
				player2.push([client.user.username, "⭕"]);
				bot = true;
				title = `${player1[0][0].toUpperCase()} VS ${client.user.username.toUpperCase()}`;
				description = `${player1[0][0]} is ${player1[0][1]}\n${player2[0][0]} is ${player2[0][1]}`;
				footer = "Are you ready?";
				buttons = [ready];
			}

			const sessionEmbed = new MessageEmbed()
				.setColor(color)
				.setTitle(title)
				.setDescription(description)
				.setFooter({ text: footer });

			i.update({
				embeds: [sessionEmbed],
				components: buttons,
			});
		});

		let gameEmbed;
		let usernameTurn = "";
		let turn = 0;

		collector.on("end", (collected) => {
			// Game Embeds
			gameEmbed = new MessageEmbed().setColor(color);
			usernameTurn = player1[turn][0];

			const playerFilter = (i) =>
				i.customId === playerJoinId || i.customId == readyId;

			const playerCollector = msg.channel.createMessageComponentCollector(
				{
					playerFilter,
					idle: 1000 * 60,
				}
			);

			let collectorIdle = true;
			if (bot) {
				playerCollector.on("collect", async (i) => {
					if (i.customId == readyId) {
						gameEmbed
							.setTitle(title)
							.setDescription(`${description}`)
							.setFooter({ text: footer });

						i.update({
							embeds: [gameEmbed],
							components: [row1, row2, row3],
						});
						collectorIdle = false;

						playerCollector.stop();
					}
				});
			} else {
				playerCollector.on("collect", async (i) => {
					if (i.user.username == msg.author.username) {
						return msg.channel.send(
							`${msg.author.username}, you cannot play against yourself!`
						);
					}
					if (i.customId === playerJoinId) {
						collectorIdle = false;

						player2.push([i.user.username, "⭕"]);
						title = `${player1[0][0].toUpperCase()} VS ${player2[0][0].toUpperCase()}`;
						description = `${player1[0][0]} is ${player1[0][1]}\n${player2[0][0]} is ${player2[0][1]}`;
						footer = `${usernameTurn}'s turn`;

						gameEmbed
							.setTitle(title)
							.setDescription(`${description}`)
							.setFooter({ text: footer });

						i.update({
							embeds: [gameEmbed],
							components: [row1, row2, row3],
						});

						playerCollector.stop();
					}
				});
			}
			playerCollector.on("end", (collected) => {
				if (collectorIdle) {
					gameEmbed
						.setTitle("SESSION TIMEOUTS")
						.setDescription(
							"Looks like none of your friends want to play with you 🥲"
						)
						.setFooter({
							text: "Make a new 'tictactoe lobby to play",
						});
					return message.edit({
						embeds: [gameEmbed],
						components: [],
					});
				}

				// TicTacToe Buttons Responds
				const gameFilter = (i) => {
					for (const id of numberId) {
						i.customId === id;
					}
				};

				const gameCollector =
					msg.channel.createMessageComponentCollector({
						gameFilter,
					});

				let pointIndexTemp;
				const boardPoints = [];
				for (let i = 0; i < 3; i++) {
					boardPoints.push([0, 0, 0]);
				}

				gameCollector.on("collect", async (i) => {
					if (i.user.username != usernameTurn) return;

					let label;
					if (usernameTurn == player1[0][0]) {
						label = player1[0][1];
					} else {
						label = player2[0][1];
					}

					// Input checker
					for (let a = 0; a < 9; a++) {
						let row = row1;
						const index = a % 3;
						if (a > 2 && a < 6) {
							row = row2;
						} else if (a >= 6) {
							row = row3;
						}
						if (i.customId == numberId[a]) {
							row.components[index].setDisabled(true);
							row.components[index].setLabel(label);

							pointIndexTemp = Math.floor(a / 3);
							if (label == player1[0][1]) {
								// Add points to player 1
								boardPoints[pointIndexTemp][a % 3] = 1;
							} else {
								boardPoints[pointIndexTemp][a % 3] = -1;
							}
							break;
						}
					}

					// Check opponents
					if (bot) {
						let botRandom = Math.floor(Math.random() * 9);
						let botRandomId = numberId[botRandom];

						// Bot Checker
						for (let a = 0; a < 9; a++) {
							let row = row1;
							const index = a % 3;
							if (a > 2 && a < 6) {
								row = row2;
							} else if (a >= 6) {
								row = row3;
							}
							if (botRandomId == numberId[a]) {
								if (row.components[index].disabled) {
									botRandom = Math.floor(Math.random() * 9);
									botRandomId = numberId[botRandom];
									a = 0;
									continue;
								}
								row.components[index].setDisabled(true);
								row.components[index].setLabel(player2[0][1]);

								// Add points to player 2
								pointIndexTemp = Math.floor(a / 3);
								boardPoints[pointIndexTemp][a % 3] = -1;
								break;
							}
						}
					} else {
						turn = (turn + 1) % 2;
						if (turn == 0) {
							usernameTurn = player1[0][0];
						} else if (turn == 1) {
							usernameTurn = player2[0][0];
						}

						footer = `${usernameTurn}'s turn`;

						gameEmbed.setFooter({ text: footer });
					}

					// CHECK FOR A WIN
					let winner = null;
					let winButtons = [];
					// console.log(boardPoints);
					// Check horizontal
					for (let i = 0; i < 3; i++) {
						let totalPoints = 0;
						winButtons = [];
						for (let j = 0; j < 3; j++) {
							totalPoints += boardPoints[i][j];
							winButtons.push([i, j]);
						}
						if (totalPoints == 3) {
							winner = player1;
							break;
						} else if (totalPoints == -3) {
							winner = player2;
							break;
						}
					}

					if (!winner) {
						// Check vertical
						for (let i = 0; i < 3; i++) {
							let totalPoints = 0;
							winButtons = [];
							for (let j = 0; j < 3; j++) {
								totalPoints += boardPoints[j][i];
								winButtons.push([j, i]);
							}
							if (totalPoints == 3) {
								winner = player1;
								break;
							} else if (totalPoints == -3) {
								winner = player2;
								break;
							}
						}
					}

					if (!winner) {
						// Check diagonal 1
						let totalPoints = 0;
						winButtons = [];
						for (let i = 0; i < 3; i++) {
							totalPoints += boardPoints[i][i];
							winButtons.push([i, i]);
							if (totalPoints == 3) {
								winner = player1;
								break;
							} else if (totalPoints == -3) {
								winner = player2;
								break;
							}
						}
					}

					if (!winner) {
						// Check diagonal 2
						totalPoints = 0;
						winButtons = [];
						let sec = 2;
						for (let i = 0; i < 3; i++) {
							totalPoints += boardPoints[i][sec];
							winButtons.push([i, sec]);
							sec -= 1;
							if (totalPoints == 3) {
								winner = player1;
								break;
							} else if (totalPoints == -3) {
								winner = player2;
								break;
							}
						}
					}

					// Check if there's a winner
					if (winner) {
						// Make every buttons disabled
						for (let a = 0; a < 9; a++) {
							let row = row1;
							const index = a % 3;
							if (a > 2 && a < 6) {
								row = row2;
							} else if (a >= 6) {
								row = row3;
							}
							row.components[index].setDisabled(true);
						}

						// Transform the winner's line to SUCCESS
						for (let i = 0; i < 3; i++) {
							let row = row1;
							const index = winButtons[i][1];
							if (winButtons[i][0] == 1) {
								row = row2;
							} else if (winButtons[i][0] == 2) {
								row = row3;
							}

							row.components[index].setStyle("PRIMARY");
						}

						gameEmbed.setTitle(
							`${winner[0][0].toUpperCase()} IS THE WINNER!`
						);

						if (winner[0][0] == client.user.username) {
							gameEmbed.setFooter({
								text: "Imagine losing to a bot 😶",
							});
						} else {
							gameEmbed.setFooter({ text: "👏 Good game" });
						}

						i.update({
							embeds: [gameEmbed],
							components: [row1, row2, row3],
						});
						gameCollector.stop();
					} else {
						// Update Board
						i.update({
							embeds: [gameEmbed],
							components: [row1, row2, row3],
						});
					}
				});
			});
		});
	},
};
