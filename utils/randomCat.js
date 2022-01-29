const axios = require("axios");

const url = "https://api.thecatapi.com/v1/images/search";

async function getRandomCat() {
	try {
		const { data } = await axios.get(url, {
			withCredentials: true,
			headers: {
				"X-API-KEY": "126ca83d-881c-4986-a0e7-573f2f097aa0",
			},
		});

		return data[0].url;
	} catch (err) {
		console.log(err);
	}
}

module.exports = getRandomCat;
