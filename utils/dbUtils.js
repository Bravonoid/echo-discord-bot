const insertData = async (msg, Model, data) => {
	// SAVE TO DB
	// Check for data on the current server
	const serverMsg = await Model.findOne({ id_server: msg.guild.id });
	// console.log(serverMsg);

	let dataArray = [data];
	if (!serverMsg) {
		const deletedMsgServer = new Model({
			id_server: msg.guild.id,
			deleted_msg: dataArray,
		});

		await Model.insertMany(deletedMsgServer);
	} else {
		dataArray = serverMsg.deleted_msg;

		if (dataArray.length >= 10) {
			dataArray.shift();
		}

		dataArray.push(data);

		const deletedMsgServer = new Model({
			id_server: msg.guild.id,
			deleted_msg: dataArray,
		});

		serverMsg.overwrite(deletedMsgServer);
		await serverMsg.save();
	}
};

// Temporary Function
const processData = (args, Model, msg) => {
	// Check amounts
	let amounts = 1;
	if (args.length >= 1 && !isNaN(args[args.length - 1])) {
		const num = args.pop();
		amounts = parseInt(num);
	}

	const messages = await Delete.findOne({ id_server: msg.guild.id });
	if (!messages) return;
	const arrayMsg = messages.deleted_msg;

	const arrEmbeds = [];
	let j = arrayMsg.length;

	if (amounts > j) amounts = j;

	return (data = {
		amounts,
		arrayMsg,
	});
};

module.exports = insertData;
