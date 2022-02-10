const axios = require("axios");

let token;
if (process.env.DICTIONARY) {
	token = process.env.DICTIONARY;
} else {
	const key = require("../../token.json");
	token = key["DICTIONARY-KEY"];
}

async function getWordData(word) {
	word = word.toLowerCase();
	const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${token}`;

	try {
		const getData = await axios.get(url);

		const data = getData.data[0];
		// console.log(data);

		// check title
		let title = data.hwi.hw;

		let subtitle = `/${data.fl}/`;
		let meaning = data.shortdef[0];

		title = title.split("*").join("");

		if (
			typeof data != "object" ||
			title.toLowerCase() != word.toLowerCase()
		) {
			title = false;
			subtitle = false;
			description = false;
		}

		const result = {
			title,
			subtitle,
			description: meaning,
		};

		// console.log(result);

		return result;
	} catch (err) {
		return false;
	}
}

// Sample case
// getWordData("apple");
// getWordData("dilema");
// getWordData("earth");
// getWordData("krona");
// getWordData("loop");
// getWordData("done");
// getWordData("hills");

module.exports = getWordData;
