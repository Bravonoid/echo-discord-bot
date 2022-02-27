module.exports = {
	name: "echo",
	description: "Command Echo `'echo #something`",
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
