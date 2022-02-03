const axios = require("axios");
const cheerio = require("cheerio");

// Current use
async function getRandomWord() {
	try {
		const url = `https://jimpix.co.uk/words/word-generator.asp`;

		const { data } = await axios.get(url, {
			withCredentials: true,
		});
		const $ = cheerio.load(data);

		// console.log($.html());

		// get title
		const scrapeTitle = $(".scrollbox span").html();

		return scrapeTitle;
	} catch (err) {
		console.log(err);
	}
}

// getRandomWord();

module.exports = getRandomWord;
