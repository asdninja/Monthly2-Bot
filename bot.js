const Discord = require('discord.js')
const bot = new Discord.Client();
bot.login(process.env.BOT_TOKEN);
var mysql = require('mysql');
const PREFIX = ';;';
const request = require("request");
var mysqlback;
var fs = require('fs');
var userData = JSON.parse(fs.readFileSync('storage/userdata.json','utf8'));
//Bot Start-------------------------------------------
bot.on('ready', () => {
    bot.user.setStatus('Online');
    bot.user.setGame('Monthly2')
})
//Mysql login-----------------------------------------
var db = {
 host: "45.67.156.82",
 user: "root",
 password: "zaitsev"
};
var connection;
//Functions----------------------------------
function RandomNum(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function DisconnectReconnect() {
 connection = mysql.createConnection(db);

 connection.connect(function(err) {
  if (err) {
   mysqlback = 0;
   console.log('Az adabázis kapcsolodásban hiba van:', err);
   setTimeout(DisconnectReconnect, 2000); //
  } else {
   mysqlback = 1;
  }
 });
 connection.on('error', function(err) {
  console.log('db error', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
   DisconnectReconnect();
  } else {
   throw err;
  }
 });
}
//Messages-------------------------------------------
bot.on('message', message => {
 var sender = message.author;
 let args = message.content.substring(PREFIX.length).split(" ");
 if(args[0] === 'játékok'){
    if(args[1] === 'érme'){
        message.reply('Példa játék ;;játékok érme fej ')
        randomnumber = RandomNum(2);
        if(args[2] === 'fej' & randomnumber === 0){
          message.reply('Nyertél gratulálok!')
        }else if(args[2] === 'írás' & randomnumber === 1){
          message.reply('Nyertél gratulálok!')
        }
        else{message.reply('Sajnálom nem nyertél')}
    }else if(args[1] === 'avatar'){
            message.reply('Tessék itt az avatárod linkje: ' + message.author.avatarURL);
    }else if (args[1] === 'üzenetek'){
    message.reply('Elküldtél eddig '+userData[sender.id].messagesSent+' db üzenetet!')
    }
    else if(args[1] === 'help'){
        message.reply('Jelenlegi prefixumok : érme,avatar,üzenetek')
    }else{
        message.reply('Nincsen ilyen prefixum ha nem találsz valamit használd az ;;játékok help parancsot');
     }
 }
 if (args[0] === 'ping') {
    message.channel.send('Pong! :smile: :ping_pong:');
 }
 if (args[0] === 'info') {
  if (args[1] === 'weboldal') {
   message.reply('http://185.234.181.181/index.php');
  } else if (args[1] === 'help') {
   message.reply('Jelenlegi prefixumok : weboldal,status,fejlesztések')
  } else if (args[1] === 'status') {
   DisconnectReconnect();
   if (mysqlback === 0) {
    DisconnectReconnect();
    message.channel.send('Az adatbázis nem fut!')
   } else {
    message.channel.send('Az adatbázis fut!')
   }
    }else if (args[1] === 'fejlesztések'){
    request({
      uri : "http://185.234.181.181/patchlist.php",
    }, function(error,response,body){
        message.member.send(body)
        message.reply('Szia rád írtam privát üzetben!');
    })
  } else {
   message.reply('Nincsen ilyen prefixum ha nem találsz valamit használd az ;;info help parancsot');
  }
 }
 if(!userData[sender.id]) userData[sender.id] ={
    messagesSent : 0
  }
userData[sender.id].messagesSent++;
fs.writeFile('storage/userdata.json', JSON.stringify(userData), (err) => {
  if(err) console.error(err);
});
})
//JOIN-----------------------------------------
