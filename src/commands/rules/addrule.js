const {Command} = require("discord.js-commando");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "addrule",
            aliases: ["ar"],
            group: "rules",
            memberName: "addrule",
            description: "Adds a rule for the server or a channel.",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    key: "subcommand",
                    prompt: "Is this a rule for the server or a channel?",
                    oneOf: ["server", "channel"],
                    type: "string",
                    defaultValue: "server"
                }
            ]
        });
    }
    
    async run(msg, {subcommand}) {
        const ruleset = msg.guild.settings.get("ruleset", {});
        // const channel = subcommand === "server" ? {id: "0"} : 
        // if (subcommand == "server") {
        //     const rule = this.getRuleResponse(msg);
        //     if (!rule) await msg.failure("Timed out waiting for the rule.");
        //     ruleset.rules.append(rule);
        // }
        // else {
        //     await msg.say(`Which channel is this for?`);
        //     const response = (await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 10000})).first();
        //     if (!response) return await msg.failure("Timed out waiting for the channel.");
        //     const channel = this.client.registry.types.get("channel").parse(response, msg.guild);
        //     if (!channel) return await msg.failure(`Could not find a channel matching \`${response}\`.`);
        //     const rule = this.getRuleResponse(msg);
        //     if (!rule) await msg.failure("Timed out waiting for the rule.");
        //     if (!ruleset[channel.id]) ruleset[channel.id] = {rules: []};
        //     ruleset[channel.id].rules.push(rule);
        // }

        let channel = {id: "server"};
        if (subcommand === "channel") {
            await msg.say(`Which channel is this for?`);
            const response = (await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 10000})).first();
            if (!response) return await msg.failure("Timed out waiting for the channel.");
            channel = this.client.registry.types.get("channel").parse(response.content, msg);
            if (!channel) return await msg.failure(`Could not find a channel matching \`${response}\`.`);
        }
        const rule = await this.getRuleResponse(msg);
        if (!rule) await msg.failure("Timed out waiting for the rule.");
        if (!ruleset[channel.id]) ruleset[channel.id] = [];
        ruleset[channel.id].push(rule);

        await msg.guild.settings.set("ruleset", ruleset);
        await msg.success("Rule added successfully.");
    }

    async getRuleResponse(msg) {
        await msg.say(`What rule would you like to add?`);
        const response = (await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 10000})).first();
        if (!response) return "";
        return response;
    }
};