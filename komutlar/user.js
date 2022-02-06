const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async (client, message, args) => {
if(message.author.id === message.guild.owner.id) return message.channel.send("Sunucu Sahibi Olmalısınız")
if(!args[0]) return message.channel.send("Bir User Belirt")
let a =args[0]
db.set(`dark_zone_user`, a)
message.channel.send(`User ${a} Olarak Ayarlandı`)


}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["User"],
  permLevel: 0
};
exports.help = {
  name: 'user'
};
