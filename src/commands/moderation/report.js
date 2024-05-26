const {MessageEmbed, Constants} = require("discord.js");
const {Command} = require("discord.js-commando");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "report",
            group: "moderation",
            memberName: "report",
            description: "Reports a user for a reason.",
            guildOnly: true,
            args: [
                {
                    key: "who",
                    prompt: "Who would you like to report?",
                    type: "user"
                },
                {
                    key: "reason",
                    prompt: "Why would you like to report them?",
                    type: "string"
                }
            ]
        });
    }
    
    async run(msg, {who, reason}) {
        const reportChannelID = msg.guild.settings.get("reportChannel", "");
        if (!reportChannelID) return await msg.failure(`No report channel set!`);
        const reportChannel = this.client.channels.cache.get(reportChannelID);
        if (!reportChannel) return await msg.failure(`Report channel not found, please set a new one!`);

        const reportEmbed = new MessageEmbed();
        reportEmbed.setTimestamp(Date.now());
        reportEmbed.setColor(Constants.Colors.FAILURE);

        reportEmbed.setAuthor(who.tag, who.displayAvatarURL());
        reportEmbed.setDescription(`Reported by <@!${msg.author.id}> in <#${msg.channel.id}>.`);
        reportEmbed.addField("Reason", reason);
        reportEmbed.setFooter(`User ID: ${msg.author.id}`);

        await reportChannel.send({embed: reportEmbed});
    }
};