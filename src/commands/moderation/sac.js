const {Command} = require("discord.js-commando");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "setannouncementchannel",
            aliases: ["sac"],
            group: "moderation",
            memberName: "setannouncementchannel",
            description: "Sets the channel for announcements.",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    key: "channel",
                    prompt: "To which channel should announcements be posted?",
                    type: "channel"
                }
            ]
        });
    }
    
    async run(msg, {channel}) {
        await msg.success(`Future announcements will be posted to <#${channel.id}>`);
        await msg.guild.settings.set("announcementChannel", channel.id);
    }
};