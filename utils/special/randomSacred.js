const axios = require("axios");

async function getAyah() {
	const random = Math.round(Math.random() * (6236 - 1) + 1);

	const urlArabic = `http://api.alquran.cloud/v1/ayah/${random}`;
	const urlEn = `http://api.alquran.cloud/v1/ayah/${random}/en.asad`;

	// Get arabic ayah
	const { data } = await axios.get(urlArabic);
	const arabic = data.data.text;

	// Get english ayah
	const { data: dataEn } = await axios.get(urlEn);
	const translate = dataEn.data.text;

	// Get other data
	const surah = dataEn.data.surah.englishName;
	const ayah = dataEn.data.numberInSurah;

	return {
		arabic,
		translate,
		surah,
		ayah,
	};
}

module.exports = getAyah;
