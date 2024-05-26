const {Command} = require("discord.js-commando");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "setreportchannel",
            aliases: ["src"],
            group: "moderation",
            memberName: "setreportchannel",
            description: "Sets the channel for reports.",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    key: "channel",
                    prompt: "To which channel should reports be posted?",
                    type: "channel"
                }
            ]
        });
    }
    
    async run(msg, {channel}) {
        await msg.success(`Future reports will be posted to <#${channel.id}>`);
        await msg.guild.settings.set("reportChannel", channel.id);
    }
};