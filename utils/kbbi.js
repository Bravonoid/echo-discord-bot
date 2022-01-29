const axios = require("axios");
const cheerio = require("cheerio");

// FETCHING FROM KBBI KEMENDIKBUD (MORE ACCURATE BUT LIMITED)
async function scrapeData(word) {
	try {
		const url = `https://kbbi.kemdikbud.go.id/entri/${word}`;

		const { data } = await axios.get(url, {
			withCredentials: true,
			headers: {
				Cookie: ".AspNet.ApplicationCookie=3lierzESCNjVJp6396CiFr9HTuaH_kzbgcM3zQG-STwh5-cX5iuclOpiWoTvdKOh_axetmEa5fI0ESmefi6fqwkGPofhSU31P4ZbfdeOjWFmm-XvuslztcpZjr5jSq1KE0mOVVPomn-4Cxfgls2pNduIhlM_2um5uE1uZmX4Cp3vRdRLpfQooZPZnGRQUqQ62qGxA_DRm_qsc-JC_vzG3yFA1V_YppzQl_ePgnGtj7Dh7vKxxOaXLTz7GJCFcUGnhFlswI8c_0HpcDPNOJkIkEpWfeLoXh2A49GiRIZvPSzxxqlOQxC9lFb9WK6PtgNjhumIIM7dbBa7I1yUEieFWoemLRfyF9U_W-6UZ_kQHdThRdW-CWinqdoDYUjKz7rHTNYRUfZrYJcwKeEgCkkvFyu_W6XtAEETvINnISyglQ_v3DWnxOe4OT6m8oI9YtbHz5ptBEQ7Pwjytw-pxlSZiDlkR3qoAHht_tqpBS1xGvSElQJdJ1wtliBgP80AHoXxDw5wT1hVdAxmsmQLA1Y6uVv2mieSRPOKtIYoy25j2TnfnllS3GodF_nd6bKXA08-sNo3AHAhFzLCdVr1Odlc4g; __RequestVerificationToken=jNBJWMpHOZy81Fy0O1HZpFFPH5aS8oZGJR1HUK5YmlteGrYe-bP6R3-bzOqjzCw2zoVefX1yALCuk3NKhFiTymw04B5fSxBbJmc1Qq1EUVE1",
			},
		});
		const $ = cheerio.load(data);

		// check entry error
		const entry = $("h4").text().includes("Entri tidak ditemukan");

		if (!entry) {
			// get title
			let title = "";
			const scrapeTitle = $("h2").text().split(" ");
			// console.log(scrapeTitle);
			for (scrape of scrapeTitle) {
				if (scrape.includes(".")) {
					title = scrape;
				}
			}
			console.log(title);

			// get subtitle
			const subtitle = $("h2 span").text();

			let descriptions = [];
			// get description
			// FIX DESCRIPTION
			let desc = $("ol li");
			let tempDesc = [];
			if (!desc.text()) {
				desc = $("ul li");
				desc.each((i, e) => tempDesc.push(`${$(e).text()}`));
				tempDesc = tempDesc[4].split(/\s\s/);
				descriptions.push(tempDesc[tempDesc.length - 1]);
			} else {
				desc.each((i, e) => {
					tempDesc.push(`${$(e).text().split(/\s\s+/)[1]}`);
				});
				descriptions.push(tempDesc[0]);
			}
			// console.log(desc.text());
			// console.log(tempDesc);
			console.log(descriptions);

			// store data
			const result = {
				title,
				subtitle,
				desc: descriptions,
			};

			// console.log(result);
			return result;
		} else {
			return "Not exist";
		}
	} catch (err) {
		console.log(err);
	}
}

// SAMPLE TEST
// console.log(scrapeData("vertebrata"));
// console.log(scrapeData("lahir"));
// console.log(scrapeData("nanogram"));
// console.log(scrapeData("gram"));

module.exports = scrapeData;
