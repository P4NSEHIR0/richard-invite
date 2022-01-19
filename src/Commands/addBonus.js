const { Discord, MessageEmbed } = require("discord.js");

  module.exports.config = {
  name: "addinvitebonus",
  aliases: ["addinvite", "davetekle", "ekledavet", "addinvites"]
  };

module.exports.execute = async(client, message, args) => {
  
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Hatalı Kullanım. ```Yetkin Yetmiyor.```");
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let Amount = args[1];
  if(!member) return message.channel.send("Hatalı Kullanım. ```"+conf.prefix+"addinvite [@richârd/ID] [Miktar]```");
  if(!Amount) return message.channel.send("Hatalı Kullanım. ```"+conf.prefix+"addinvite [@richârd/ID] [Miktar]```");
  inviteDB.s.add(`invite.${member.id}.bonus`, +Amount)
  inviteDB.s.add(`invite.${member.id}.total`, +Amount)
  
  message.channel.send(`${member} kullanıcısına **${Amount}** adet bonus davet ${message.member} yetkilisi tarafından eklendi.`);
  };
