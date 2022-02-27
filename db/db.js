const mongoose = require("mongoose");

let token;
if (process.env.DB) {
	token = process.env.DB;
} else {
	const key = require("../token.json");
	token = key["DB"];
}

mongoose.connect(token);
