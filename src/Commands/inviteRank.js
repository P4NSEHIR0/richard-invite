const { Discord, MessageEmbed } = require("discord.js");

  module.exports.config = {
  name: "davet",
  aliases: ["davetlerim", "invites"]
  };

module.exports.execute = async(client, message, args) => {
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

  const invMember = await inviteDB.get(`invite.${member.id}.total`)

if(!invMember) message.channel.send(new MessageEmbed().setDescription(`Veritabanına herhangi bir davet verisi bulunamadı.`).setColor("RENKXD").setFooter(conf.footer).setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true, size: 2048 })));
else message.channel.send(new MessageEmbed().setDescription(`${member} kullanıcısının davet bilgileri;
Toplam ${inviteDB.get(`invite.${member.id}.total`) || 0} davet. **[** ${inviteDB.get(`invite.${member.id}.regular`) || 0} gerçek, ${inviteDB.get(`invite.${member.id}.bonus`) || 0} bonus, ${inviteDB.get(`invite.${member.id}.quit`) || 0} çıkış, ${inviteDB.get(`invite.${member.id}.fake`) || 0} fake **]**`).setColor("RENKXD").setFooter(conf.footer).setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true, size: 2048 })))
  };
