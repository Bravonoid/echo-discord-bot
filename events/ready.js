const { prefixes } = require("../config.json");

module.exports = {
	name: "ready",
	execute(client) {
		console.log(`Logged in as ${client.user.tag}!`);
		client.user.setPresence({
			activities: [{ name: `${prefixes}help` }],
			status: "online",
		});
	},
};
