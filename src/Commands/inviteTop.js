const { Discord, MessageEmbed } = require("discord.js");

  module.exports.config = {
  name: "topinvite",
  aliases: ["invtop", "invite-top", "davet-top", "davettop"]
};

module.exports.execute = async(client, message, args) => {
    

    let invitescrable = inviteDB.get("invite") || {};

    if (!invitescrable) return message.channel.send(new MessageEmbed().setDescription(`Sıralama için yeterli veri bulunamadı!`).setColor("RENKXD").setFooter(conf.footer).setAuthor(message.member.user.tag, message.member.user.avatarURL({ dynamic: true, size: 2048 })));

    let inviteschema = Object.keys(invitescrable);

    let invitetop = inviteschema.filter(x => message.guild.members.cache.has(x)).sort((a, b) => Number(invitescrable[b].total || 0) - Number((invitescrable[a].total))).map((value, index) => `**[**${index+1}.**]** ${message.guild.members.cache.get(value)}: ${invitescrable[value].total || 0} davet **[**\`${invitescrable[value].join || 0} gerçek/${invitescrable[value].total || 0} toplam\`**]**`).splice(0, 15).join("\n");

    message.channel.send(new MessageEmbed().setDescription(`${invitetop || 'Sıralama için yeterli veri bulunamadı!'}`).setColor("RENKXD").setFooter(conf.footer).setAuthor(message.member.user.tag, message.member.user.avatarURL({ dynamic: true, size: 2048 })));
  };