const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async (client, message, args) => {
if(message.author.id === message.guild.owner.id) return message.channel.send("Sunucu Sahibi Olmalısınız")
if(!args[0]) return message.channel.send("Bir Host Belirt")
db.set(`dark_zone_host`, args[0])
message.channel.send(`Host ${args[0]} Olarak Ayarlandı`)


}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["host"],
  permLevel: 0
};
exports.help = {
  name: 'Host'
};
