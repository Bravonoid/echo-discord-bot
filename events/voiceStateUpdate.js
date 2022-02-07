module.exports = {
	name: "voiceStateUpdate",
	async execute(oldState, client) {
		// when channel is empty, bot disconnected
		oldState.guild.channels
			.fetch(oldState.member.voice.channelId)
			.then((res) => {
				let total = 0;
				if (res.members) {
					total = res.members.size;
					if (total == 1) {
						oldState.guild.me.voice.disconnect();
					}
				}
			});

		// console.log(`${oldState.member.user.username} did something`);
		// if (oldState.member.user.username == "Autoruns") {
		// 	await oldState.disconnect();
		// 	console.log(`${oldState.member.user.username} has been removed`);
		// }
	},
};
