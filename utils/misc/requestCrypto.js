const axios = require("axios");

async function getCrypto(symbol = "BTC", currency = "USD") {
	const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=${currency}`;
	const urlMeta = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${symbol}`;

	try {
		const { data } = await axios.get(url, {
			withCredentials: true,
			headers: {
				"X-CMC_PRO_API_KEY": "78256cab-3691-45e2-835b-1f13cb749b9a",
			},
		});

		const dataLogo = await axios.get(urlMeta, {
			withCredentials: true,
			headers: {
				"X-CMC_PRO_API_KEY": "78256cab-3691-45e2-835b-1f13cb749b9a",
			},
		});

		// console.log(data);
		// console.log(dataLogo.data.data[symbol].logo);

		const result = data.data[symbol];
		// console.log(result);
		const logoURL = dataLogo.data.data[symbol].logo;

		const price = result.quote[currency].price.toLocaleString();

		const volume24 = result.quote[currency].volume_24h.toLocaleString();

		const percent24H = result.quote[currency].percent_change_24h.toString();

		const percent7D = result.quote[currency].percent_change_7d.toString();

		const marketCap = result.quote[currency].market_cap.toLocaleString();

		const response = {
			name: result.name,
			symbol: result.symbol,
			logo: logoURL,
			currency,
			price,
			percent24H,
			percent7D,
			volume24,
			marketCap,
		};
		// console.log(response);

		return response;
	} catch (err) {
		// return false
		console.log(err);
	}
}

// SAMPLE CASE
getCrypto();
// getCrypto("BTC");
// getCrypto("BTC", "IDR");
// getCrypto("ETH", "IDR");

module.exports = getCrypto;
