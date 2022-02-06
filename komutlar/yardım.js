const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async (client, message, args) => {
message.channel.send(new Discord.MessageEmbed()

) 
}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["yardım"],
  permLevel: 0
};
exports.help = {
  name: 'Help'
};
