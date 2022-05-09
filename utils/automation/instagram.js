const Insta = require("scraper-instagram");
const InstaClient = new Insta();

// Fix for instagram's weird behavior
function getFromPost(shortcode) {
	InstaClient.getPost(shortcode)
		.then((post) => {
			return {
				username: post.author.username,
				profilePic: post.author.pic,
				postContent: post.contents.map((e) => e.url),
				caption: post.caption,
				likes: post.likes,
				timestamp: post.timestamp,
				link: post.link,
			};
		})
		.catch((err) => {
			console.log(err, "error");
		});
}

module.exports = getFromPost;
