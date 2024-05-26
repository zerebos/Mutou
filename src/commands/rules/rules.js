const {MessageEmbed, Constants} = require("discord.js");
const {Command} = require("discord.js-commando");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "rules",
            group: "rules",
            memberName: "rules",
            description: "Shows the rules in a given channel.",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    key: "channel",
                    prompt: "To which channel should I post the rules?",
                    type: "channel"
                }
            ]
        });
    }
    
    async run(msg, {channel}) {
        const ruleset = msg.guild.settings.get("ruleset", {});
        // let ruleString = ">>> ";
        // for (const id in ruleset) {
        //     let title = `<#${id}>\n`;
        //     if (id === "server") title = `**${msg.guild.name} Server Rules**\n`;
        //     const rules = ruleset[id].map((r, i) => `${i + 1}. ${r}\n`);
        //     ruleString += title + rules + "\n";
        // }
        // await channel.send(ruleString);

        const rulesEmbed = new MessageEmbed();
        rulesEmbed.setAuthor(`${msg.guild.name} Server Rules`, msg.guild.iconURL());
        rulesEmbed.setColor(Constants.Colors.INFO);
        
        let description = "";
        for (const id in ruleset) {
            const title = id === "server" ? "" : `<#${id}>\n`;
            const rules = ruleset[id].map((r, i) => `${i + 1}. ${r}`).join("\n");
            description += title + rules + "\n";
        }

        rulesEmbed.setDescription(description);

        await channel.send({embed: rulesEmbed});
    }
};
