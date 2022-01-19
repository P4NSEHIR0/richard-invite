const { Collection, Client, MessageEmbed, WebhookClient } = require("discord.js");
const client = global.client = new Client({ fetchAllMembers: true });
const Invites = new Collection();
const moment = require("moment");
moment.locale("tr");
const Logs = require("discord-logs");
Logs(client);
///////////////// GLOBALS /////////////////
const conf = global.conf = require("./src/Configs/Config.json");
client.login(conf.token).catch(err => err.console.log("token hatalı knk"))
const Veritabani = require("fresh.db");
let inviteDB = global.inviteDB = new Veritabani({name:"inviteDB", prettySave: true, folderPath:__dirname + "/src/Models"});
//////////////// GLOBALS /////////////////
//// COMMAND HANDLER ////
const fs = require("fs");
const commands = new Map();
global.commands = commands;
const aliases = new Map();
global.aliases = aliases;
//// COMMAND HANDLER ////

client.on("message", (message) => {
    if (message.author.bot ||!message.content.startsWith(conf.prefix) || !message.channel || message.channel.type == "dm") return;
    let args = message.content
        .substring(conf.prefix.length)
        .split(" ");
    let command = args[0];
    let bot = message.client;
    args = args.splice(1);
    let calistirici;
    if (commands.has(command)) {
      calistirici = commands.get(command);
      calistirici.execute(bot, message, args);
    } else if (aliases.has(command)) {
      calistirici = aliases.get(command);
      calistirici.execute(bot, message, args);
    }
  })
      /////////////////// HANDLER ///////////////////
  fs.readdir("./src/Commands", (err, files) => {
    if(err) return console.error(err);
      files = files.filter(file => file.endsWith(".js"));
      console.log('\x1b[36m%s\x1b[0m', `[ ${files.length} COMMANDS LOADED ]`);
      files.forEach(file => {
  let prop = require(`./src/Commands/${file}`);
    if(!prop.config) return;
    if(typeof prop.onLoad === "function") prop.onLoad(client);
      commands.set(prop.config.name, prop);
    if(prop.config.aliases) prop.config.aliases.forEach(aliase => aliases.set(aliase, prop));
    });
  });
      ///////////////////
  fs.readdir("./src/Events", (err, files) => {
    if(err) return console.error(err);
    console.log('\x1b[36m%s\x1b[0m', `[ ${files.length} EVENTS LOADED ]`);
      files.filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./src/Events/${file}`);
    if(!prop.config) return;
        client.on(prop.config.name, prop);
        });
      });
  /////////////////// HANDLER ///////////////////
  
client.on("ready", () => {
  client.guilds.cache.get(conf.server).fetchInvites().then((_invite) => Invites.set(_invite.first().guild.id, _invite))

});

client.on("inviteCreate", (invite) => {
  const GuildInvites = Invites.get(invite.guild.id);
  GuildInvites.set(invite.code, invite);
  Invites.set(invite.guild.id, GuildInvites);
});

client.on("inviteDelete", (invite) => {
  const GuildInvites = Invites.get(invite.guild.id);
  GuildInvites.delete(invite.code, invite);
  Invites.set(invite.guild.id, GuildInvites);
});


client.on("guildMemberAdd", async (member) => {
  if (member.user.bot) return;

  const Guild = member.guild;
  const Fake = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * conf.day;
  const GuildInvites = (Invites.get(member.guild.id) || new Collection()).clone();
  const InviteChannel = Guild.channels.cache.get(conf.log);
  let content;        

  Guild.fetchInvites().then(async (_invites) => {
      const InviteCode = _invites.find((_invite) => GuildInvites.has(_invite.code) && GuildInvites.get(_invite.code).uses < _invite.uses) || GuildInvites.find((_invite) => !_invites.has(_invite.code)) || Guild.vanityURLCode;
      Invites.set(Guild.id, _invites);

      if (InviteCode.inviter && InviteCode.inviter.id !== member.id) {
          inviteDB.set(`${member.id}.inviter`, InviteCode.inviter.id);
          if (Fake) inviteDB.s.add(`invite.${InviteCode.inviter.id}.fake`, +1);
          else inviteDB.s.add(`invite.${InviteCode.inviter.id}.regular`, +1); inviteDB.s.add(`invite.${InviteCode.inviter.id}.total`, +1);
          var data = inviteDB.get(`invite.${InviteCode.inviter.id}.total`);
      }

          if (InviteCode === Guild.vanityURLCode) content = `${member} sunucuya özel davet linkini kullanarak girdi!`;
          else if (InviteCode.inviter.id === member.id) content = `${member} kendi daveti ile sunucuya giriş yaptı.`;
          else content = `${member} katıldı! **Davet eden**: ${InviteCode.inviter} **[** ${data || 0} davet **]** ${Fake ? ":x:" : ":white_check_mark:"}`;
          InviteChannel.send(content).catch((err) => console.log(err));

  });
});

client.on("guildMemberRemove", async (member) => {
  if (member.user.bot) return;

  const Guild = member.guild;
  const Channel = Guild.channels.cache.get(conf.log);
  const Data = await inviteDB.get(`${member.id}.inviter`);
  if (!Data && Data == null && Data == undefined) return Channel.send(`${member} sunucudan çıktı.`);
  const Fake = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;
  inviteDB.s.add(`invite.${Data}.quit`, 1); inviteDB.s.subtract(`invite.${Data}.total`, 1)

  const datas = inviteDB.get(`invite.${Data}.total`);
  if (Channel) Channel.send(`${member} sunucudan çıktı. **Davet eden**: <@${Data}> **[** ${datas || 0} davet **]**`);

});