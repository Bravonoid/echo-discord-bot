const axios = require("axios");

const url = "https://api.thecatapi.com/v1/images/search";

let token;
if (process.env.CAT) {
	token = process.env.CAT;
} else {
	const key = require("../../token.json");
	token = key["X-API-KEY"];
}

async function getRandomCat() {
	try {
		const { data } = await axios.get(url, {
			withCredentials: true,
			headers: {
				"X-API-KEY": token,
			},
		});

		return data[0].url;
	} catch (err) {
		console.log(err);
	}
}

module.exports = getRandomCat;
