const { prefixes } = require("../config.json");

module.exports = {
	name: "ready",
	execute(client) {
		// TRY RICH PRESENCE

		const activities = [
			{
				name: `${prefixes}help`,
				type: `LISTENING`,
			},
		];

		console.log(
			`Logged in as ${client.user.tag}!\nServing ${client.guilds.cache.size} servers`
		);
		client.user.setPresence({
			activities: activities,
			status: "online",
		});
	},
};
