const axios = require("axios");

async function getWordData(word) {
	word = word.toLowerCase();
	const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=b96c5c46-e8ca-41c4-bd4c-5236bd6cd70f`;

	try {
		const getData = await axios.get(url);

		const data = getData.data[0];
		// console.log(data);

		// check title
		let title = data.hwi.hw;
		title = title.split("*").join("");
		if (title != word) return;

		const subtitle = `/${data.fl}/`;
		const meaning = data.shortdef[0];

		const result = {
			title,
			subtitle,
			description: meaning,
		};

		// console.log(result);

		return result;
	} catch (err) {
		return err;
	}
}

// Sample case
// getWordData("apple");
// getWordData("dilema");
// getWordData("earth");
// getWordData("krona");
// getWordData("looping");
// getWordData("loop");
// getWordData("done");
// getWordData("rounding");

module.exports = getWordData;
