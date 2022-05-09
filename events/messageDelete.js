const { Delete } = require("../db/models");
const { insertData } = require("../utils/dbUtils");

module.exports = {
	name: "messageDelete",
	async execute(msg) {
		// console.log(msg.content);
		if (msg.author.bot || msg.content.length >= 256) return;

		// Message manipulation
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
			content: msg.content,
			date,
			author,
			channel,
		};

		// Check for attachment
		const attachment = msg.attachments.first();
		if (attachment) {
			data = {
				content: msg.content,
				date,
				author,
				channel,
				attachment: attachment.attachment,
			};
		}

		// Save to database
		insertData(msg, Delete, data);
	},
};
