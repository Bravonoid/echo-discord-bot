const Delete = require("../db/deletedDB");

module.exports = {
	name: "messageDelete",
	async execute(msg, client) {
		// console.log(msg.content);
		if (msg.content.startsWith("'echo")) return;

		// Message manipulation
		// Date
		let date = new Date(msg.createdTimestamp);
		const dateInID = date.toLocaleDateString("id-ID");
		const timeInID = date
			.toLocaleString("id-ID", {
				timeStyle: "short",
				hour12: true,
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

		// Check for data on the current server
		const serverMsg = await Delete.findOne({ id_server: msg.guild.id });
		// console.log(serverMsg);

		let deletedArray = [data];
		if (!serverMsg) {
			const deletedMsgServer = new Delete({
				id_server: msg.guild.id,
				deleted_msg: deletedArray,
			});

			await Delete.insertMany(deletedMsgServer);
		} else {
			deletedArray = serverMsg.deleted_msg;

			if (deletedArray.length >= 10) {
				deletedArray.shift();
			}

			deletedArray.push(data);

			const deletedMsgServer = new Delete({
				id_server: msg.guild.id,
				deleted_msg: deletedArray,
			});

			serverMsg.overwrite(deletedMsgServer);
			await serverMsg.save();
		}
	},
};
