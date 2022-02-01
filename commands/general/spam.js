module.exports = {
	name: "spam",
	description: "Spam message `'spam #something`",
	execute(msg, args) {
		if (args[1]) {
			args.shift();
			const command = args.join(" ");
			msg.delete();
			let total = 0;
			const interval = setInterval(() => {
				msg.channel.send(command);
				total += 1;
				if (total == 15) {
					clearTimeout(interval);
				}
			}, 500);
		}
	},
};
