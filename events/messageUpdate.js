const { Update } = require("../db/models");
const { insertData } = require("../utils/dbUtils");

module.exports = {
	name: "messageUpdate",
	execute(msg) {
		// console.log(msg);
		if (msg.author.bot || msg.content.startsWith("http")) return;

		// Message Manipulation
		// Manage contents
		const oldContent = msg.content;
		const newContent = msg.reactions.message.content;

		if (oldContent.length >= 256 || newContent.length >= 256) return;

		// Date
		let date = new Date(msg.createdTimestamp);
		const dateInID = date.toLocaleDateString("id-ID", {
			timeZone: "Asia/Jakarta",
		});
		const timeInID = date
			.toLocaleString("id-ID", {
				timeStyle: "short",
				hour12: true,
				timeZone: "Asia/Jakarta",
			})
			.replace(".", ":");

		date = `(${dateInID}) - ${timeInID} (GMT+7)`;
		// console.log(date);

		// Author
		const author = msg.author.id;

		// Channel
		const channel = msg.channelId;

		let data = {
			old: oldContent,
			new: newContent,
			date,
			author,
			channel,
		};

		// Save to database
		insertData(msg, Update, data);
	},
};
