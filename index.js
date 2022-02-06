const fetch = require('node-fetch')
const mysqldump = require('mysqldump')
var cron = require('node-cron')
var fs = require('fs')
const config = require("./config.json")
const db = require("quick.db")
const Discord = require("discord.js")
client.login(ayarlar.token).catch(err => console.log(`Giriş yapamadı sebep: ${err}`))
client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});
process.on('unhandledRejection', error => {
console.error('Unhandled promise rejection:', error);
});
client.on("ready", () => {
    client.user.setPresence({activity: {name: ("Test DZ")}, status: "dnd"})
console.log("[BOT}] Bot Ready")
})

const log = message => {
  console.log(`${message}`);
};

client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(' ')[0].slice(ayarlar.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
})



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
  });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

  
client.yetkiler = message => {
  if(!message.guild) {
	return; }
  let permlvl = -ayarlar.varsayilanperm  ;
  if(message.member.permissions.has("MANAGE_MESSAGES")) permlvl = 1;
  if(message.member.permissions.has("KICK_MEMBERS")) permlvl = 2;
  if(message.member.permissions.has("BAN_MEMBERS")) permlvl = 3;
  if(message.member.permissions.has("MANAGE_GUILD")) permlvl = 4;
  if(message.member.permissions.has("ADMINISTRATOR")) permlvl = 5;
  if(message.author.id === message.guild.ownerID) permlvl = 6;
  if(message.author.id === ayarlar.sahip) permlvl = 7;
  return permlvl;
};
console.log("[START] ")
let  filename_pref  = db.fetch(`dark_zone_prefix`)
try {

    cron.schedule('0 00 11 * * *', () => {
        // Running backups daily at 11 am UTC

        var n = new Date();
        var d = n.getUTCDate();
        var m = n.getUTCMonth();
        var y = n.getUTCFullYear();

        var D = d
        if(D < 10) D = '0' + D

        var M = m + 1
        if(M < 10) M = '0' + M
        
        var date = y + '_' + M + '_' + D


        // MYSQL

        console.log(`[BACKUP] Backup Oluşturuldu " ${filename_pref} -${date}.sql.gz"...`)
        
        mysqldump({
            
            connection: {
                host: db.fetch(`dark_zone_host`),
                user: db.fetch(`dark_zone_user`),
                password: db.fetch(`dark_zone_password`),
                database: db.fetch(`dark_zone_data`)
            },
            dumpToFile: __dirname + '/backups/' +` ${filename_pref}  `+ '-' + date + '.sql.gz',
            compressFile: true, 

        }).then(res => { 

            console.log(`[DONE]   Backup \" ${filename_pref} -${date}.sql.gz\" created!`)

            var message = {
                "embed": {
                    "title": ":information_source: Backup complete!",
                    "description": `<:greentick:678397805454295079> Backup \` ${filename_pref} -${date}.sql.gz\` created!`,
                    "color": 14561896
                }
            }

            // Send to #database-backups channel
            fetch(db.fetch(`dark_zone_webhook`), {
                method: 'POST',
                headers: 
                    {
                        'Content-Type': 'application/json'
                    },
                body: JSON.stringify({"dev by": "Dark Zone" , "content": "<@"+db.fetch(`dark_zone_id`) +">", "embeds": [ message.embed ]})
            })

            // Delete old backup
            var old_n = new Date();
            old_n.setDate(old_n.getDate() - 1);

            var old_d = old_n.getUTCDate();
            var old_m = old_n.getUTCMonth();
            var old_y = old_n.getUTCFullYear();
    
            var old_D = old_d
            if(old_D < 10) old_D = '0' + old_D
    
            var old_M = old_m + 1
            if(old_M < 10) old_M = '0' + old_M
            
            var old_date = old_y + '_' + old_M + '_' + old_D

            var oldFile = __dirname + '/backups/' + ` ${filename_pref} ` + '-' + old_date + '.sql.gz'

            fs.unlink(oldFile, (err) => {

                if (err) return console.error(err)
              
                // Old backup removed
                console.log(`[DELETE] Backup \" ${filename_pref} -${old_date}.sql.gz\" deleted!`)

            })

        });

    }, {
        scheduled: true,
        timezone: "UTC"
    });

} catch (err) {

    console.error(err)

    var message = {
        "embed": {
            "title": ":warning: Backup failed!",
            "description": `<:redtick:678397805458620461> Backup \` ${filename_pref} -${date}.sql.gz\` failed!\n\n\`\`\`\n${err}\`\`\``,
            "color": 14561896
        }
    }

    // Send to #database-backups channel
    fetch(db.fetch(`dark_zone_webhook`), {
        method: 'POST',
        headers: 
            {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify({"dev by": "Dark Zone" , "content": "<@"+db.fetch(`dark_zone_id`) +">", "embeds": [ message.embed ]})
    })

}