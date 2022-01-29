const { Collection } = require("discord.js");
const fs = require("fs");

// node of commands
const nodesFiles = fs.readdirSync("./commands");
[nodesFiles[0], nodesFiles[1]] = [nodesFiles[1], nodesFiles[0]];

// general commands
const commands = new Collection();
const files = fs
	.readdirSync("./commands/general")
	.filter((file) => file.endsWith(".js"));

for (const file of files) {
	const command = require(`../commands/general/${file}`);
	commands.set(command.name, command);
}

// music commands
const musicCommands = new Collection();
const musicFiles = fs
	.readdirSync("./commands/music")
	.filter((file) => file.endsWith(".js"));

for (const file of musicFiles) {
	const command = require(`../commands/music/${file}`);
	musicCommands.set(command.name, command);
}

// game commands
const gameCommands = new Collection();
const gameFiles = fs
	.readdirSync("./commands/game")
	.filter((file) => file.endsWith(".js"));

for (const file of gameFiles) {
	const command = require(`../commands/game/${file}`);
	gameCommands.set(command.name, command);
}

module.exports = { commands, musicCommands, gameCommands, nodesFiles };
