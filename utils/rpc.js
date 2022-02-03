const RPC = require("discord-rpc");
const browser = typeof window !== "undefined";
const rpc = new RPC.Client({ transport: browser ? "websocket" : "ipc" });

const activity = {
	details: "Classified",
	state: "On Progress",
	assets: {
		large_image: "beta",
		large_text: "Shush!",
	},
	buttons: [
		{
			label: "Secret",
			url: "https://discord.com/api/oauth2/authorize?client_id=930670709695463464&permissions=8&scope=bot%20applications.commands",
		},
	],
};

rpc.on("ready", () => {
	try {
		rpc.request("SET_ACTIVITY", { pid: process.pid, activity: activity });
	} catch (err) {
		return;
	}
});

rpc.login({ clientId: "930670709695463464" });
