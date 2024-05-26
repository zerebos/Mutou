const {MessageEmbed} = require("discord.js");
const {Command} = require("discord.js-commando");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "announce",
            group: "moderation",
            memberName: "announce",
            description: "Makes an announcement to the announcement channel.",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    key: "announcement",
                    prompt: "What announcement would you like to make?",
                    type: "string"
                }
            ]
        });
    }
    
    async run(msg, {announcement}) {
        const announcementChannelID = msg.guild.settings.get("announcementChannel", "");
        if (!announcementChannelID) return await msg.failure(`No announcement channel set!`);
        const announcementChannel = this.client.channels.cache.get(announcementChannelID);
        if (!announcementChannel) return await msg.failure(`Announcement channel not found, please set a new one!`);

        const announcementEmbed = new MessageEmbed();
        announcementEmbed.setAuthor("Announcement", msg.guild.iconURL());
        announcementEmbed.setFooter(`Made By ${msg.author.tag}`, msg.author.displayAvatarURL());
        announcementEmbed.setTimestamp(Date.now());
        announcementEmbed.setColor(msg.member.displayColor);
        announcementEmbed.setDescription(announcement);

        await announcementChannel.send({embed: announcementEmbed});
    }
};