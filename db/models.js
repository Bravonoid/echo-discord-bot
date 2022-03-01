const mongoose = require("mongoose");

const Delete = mongoose.model("delete", {
	id_server: {
		type: String,
		required: true,
	},
	deleted_msg: {
		type: Array,
	},
});

const Update = mongoose.model("update", {
	id_server: {
		type: String,
		required: true,
	},
	deleted_msg: {
		type: Array,
	},
});

module.exports = { Delete, Update };
