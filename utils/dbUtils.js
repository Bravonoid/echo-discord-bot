// Array data
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

const processData = async (args, Model, msg) => {
	// Check amounts
	let amounts = 1;
	if (args.length >= 1 && !isNaN(args[args.length - 1])) {
		const num = args.pop();
		amounts = parseInt(num);
	}

	const messages = await Model.findOne({ id_server: msg.guild.id });
	if (!messages) return;
	const arrayMsg = messages.deleted_msg;

	let j = arrayMsg.length;

	if (amounts > j) amounts = j;

	return (data = {
		amounts,
		arrayMsg,
		j,
	});
};

// User data
const insertDataUser = async (msg, Model, data) => {
	// SAVE TO DB
	// Check for data on the current server
	const serverMsg = await Model.findOne({ id_server: msg.guild.id });
	// console.log(serverMsg);

	let dataArray = [data];
	if (!serverMsg) {
		data.calls = 1;
		const userMsg = new Model({
			id_server: msg.guild.id,
			users: dataArray,
		});

		await Model.insertMany(userMsg);
	} else {
		dataArray = serverMsg.users;
		// console.log(dataArray);

		let found = false;
		dataArray.forEach((data) => {
			if (data.id == msg.author.id) {
				data.calls += 1;
				found = true;
			}
		});

		if (!found) dataArray.push(data);

		await Model.updateOne(
			{ id_server: msg.guild.id },
			{ users: dataArray }
		);
	}
};

module.exports = { insertData, processData, insertDataUser };
