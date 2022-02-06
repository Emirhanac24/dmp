const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async (client, message, args) => {
if(message.author.id === message.guild.owner.id) return message.channel.send("Sunucu Sahibi Olmalısınız")
if(!args[0]) return message.channel.send("Bir Prefix Belirt")
let a =args[0]
db.set(`dark_zone_prefix`, a)
message.channel.send(`Prefix ${a} Olarak Ayarlandı`)


}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["Prefix"],
  permLevel: 0
};
exports.help = {
  name: 'prefix'
};
