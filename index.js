const { Client, Intents } = require("discord.js");
const fs = require("fs");
const { Player } = require("discord-music-player");
// Development only
// const { TOKEN } = require("./token.json");

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

client.login(process.env.TOKEN || TOKEN);
