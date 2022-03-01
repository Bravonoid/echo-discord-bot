const { MessageEmbed } = require("discord.js");
const client = require("nekos.life");

module.exports = {
  name: "neko",
  description: "Sends a sus neko image",
  execute(msg) {
    const neko = new client();
    neko.nsfw.randomHentaiGif().then((neko) => {
      const embed = new MessageEmbed()
        .setTitle("Neko")
        .setImage(neko.url)
        .setColor("RANDOM");
      msg.channel.send({ embeds: [embed] });
    });
  },
};
