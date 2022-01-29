module.exports = {
	name: "say",
	description: "Command Beta\n`'say ?thing`",
	execute(msg, args) {
		if (args[1]) {
			args.shift();
			const command = args.join(" ");
			msg.delete();
			msg.channel.send(command);
		} else {
			msg.delete();
			msg.channel.send("Um...");
		}
	},
};
