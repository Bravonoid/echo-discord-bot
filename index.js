const { Client, Intents } = require("discord.js");
const fs = require("fs");
const { Player } = require("discord-music-player");

let token;
if (process.env.TOKEN) {
	token = process.env.TOKEN;
} else {
	const key = require("./token.json");
	token = key.TOKEN;
}

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

// music config
const player = new Player(client, {
	leaveOnEmpty: false,
});
client.player = player;

// Error handler
// process.on("unhandledRejection", (error) => {
// 	console.error("Unhandled promise rejection:", error);
// 	// return;
// });

const eventFiles = fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (args) => event.execute(args, client));
	} else {
		client.on(event.name, (args) => event.execute(args, client));
	}
}

client.login(token);
