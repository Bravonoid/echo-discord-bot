const axios = require("axios");
const cheerio = require("cheerio");

// FETCHING FROM KBBI (LESS ACCURATE BUT CAN BE USED FREELY)
// Current use
async function scrapeData(word) {
	try {
		const url = `https://kbbi.web.id/${word}`;

		const { data } = await axios.get(url, {
			withCredentials: true,
		});
		const $ = cheerio.load(data);

		// check entry
		// get title
		let title = "";
		const scrapeTitle = $("#desc #d1 b").html();
		if (scrapeTitle) {
			if (scrapeTitle.includes("<sup>")) {
				title = scrapeTitle.split("<sup>").shift();
			} else {
				title = scrapeTitle;
			}
			title = title.replaceAll("·", ".");
			// console.log(title);

			// get subtitle
			const subtitle = `/${title.split(".").join("").replace(" ", "")}/`;
			// console.log(subtitle);

			// get description
			const border = ` ${$("#d1 em").contents().first().text()}`;
			let descriptions = $("#d1").contents().text();
			descriptions = descriptions.substring(
				descriptions.indexOf(border) + border.length + 1
			);
			if (descriptions.includes(";")) {
				descriptions = descriptions.split(";")[0];
			}

			if (!isNaN(parseInt(descriptions[0]))) {
				descriptions = descriptions.substring([2]);
			}
			// console.log(border);
			// console.log(descriptions);

			// store data
			const result = {
				title,
				subtitle,
				desc: descriptions,
			};

			// console.log(result);
			return result;
		} else {
			const result = {
				title: "not found",
				subtitle: "not found",
				desc: "not found",
			};

			return result;
		}
	} catch (err) {
		console.log(err);
	}
}

// console.log(scrapeData("vertebrata"));
// console.log(scrapeData("kaki"));
// console.log(scrapeData("nganjuk"));

module.exports = scrapeData;
