const {Command} = require("discord.js-commando");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "editrule",
            aliases: ["er"],
            group: "rules",
            memberName: "editrule",
            description: "Edits a rule for the server or a channel.",
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
        // if (subcommand == "server") {
        //     // Get the rule number
        //     const ruleNum = this.getRuleNumber(msg);
        //     if (!ruleNum) await msg.failure("Timed out waiting for the rule number.");

        //     // Validate the index
        //     const index = ruleNum - 1;
        //     if (index < 0) return await msg.failure(`Lists start at 1.`);
        //     if (index >= ruleset.rules.length) return await msg.failure(`There is no rule number \`${ruleNum}\``);

        //     // Get the new rule
        //     const rule = this.getRuleResponse(msg);
        //     if (!rule) await msg.failure("Timed out waiting for the new rule.");

        //     // Set the new rule
        //     ruleset.rules[index] = rule;
        // }
        // else {
        //     // Get the channel
        //     await msg.say(`Which channel is this for?`);
        //     const response = (await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 10000})).first();
        //     if (!response) return await msg.failure("Timed out waiting for the channel.");
        //     const channel = this.client.registry.types.get("channel").parse(response, msg.guild);
        //     if (!channel) return await msg.failure(`Could not find a channel matching \`${response}\`.`);

        //     // Get the rule number
        //     const ruleNum = this.getRuleNumber(msg);
        //     if (!ruleNum) await msg.failure("Timed out waiting for the rule number.");
        //     if (!ruleset[channel.id]) ruleset[channel.id] = {rules: []};

        //     // Validate the index
        //     const index = ruleNum - 1;
        //     if (index < 0) return await msg.failure(`Lists start at 1.`);
        //     if (index >= ruleset.rules.length) return await msg.failure(`There is no rule number \`${ruleNum}\``);

        //     // Get the new rule
        //     const rule = this.getRuleResponse(msg);
        //     if (!rule) await msg.failure("Timed out waiting for the new rule.");

        //     // Set the new rule
        //     ruleset[channel.id].rules[index] = rule;
        // }

        // Get the channel
        let channel = {id: "server"};
        if (subcommand === "channel") {
            await msg.say(`Which channel is this for?`);
            const response = (await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 10000})).first();
            if (!response) return await msg.failure("Timed out waiting for the channel.");
            channel = this.client.registry.types.get("channel").parse(response.content, msg);
            if (!channel) return await msg.failure(`Could not find a channel matching \`${response}\`.`);
        }

        // Get the rule number
        const ruleNum = await this.getRuleNumber(msg);
        if (!ruleNum) await msg.failure("Timed out waiting for the rule number.");
        if (!ruleset[channel.id]) ruleset[channel.id] = [];

        // Validate the index
        const index = ruleNum - 1;
        if (index < 0) return await msg.failure(`Lists start at 1.`);
        if (index >= ruleset[channel.id].length) return await msg.failure(`There is no rule number \`${ruleNum}\``);

        // Get the new rule
        const rule = await this.getRuleResponse(msg);
        if (!rule) await msg.failure("Timed out waiting for the new rule.");

        // Set the new rule
        ruleset[channel.id][index] = rule;

        await msg.guild.settings.set("ruleset", ruleset); // Save changes
        await msg.success("Rule changed successfully.");
    }

    async getRuleNumber(msg) {
        await msg.say(`Which rule would you like to delete?`);
        const response = (await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 10000})).first();
        const num = parseInt(response);
        if (Number.isNaN(num)) return "";
        return num;
    }

    async getRuleResponse(msg) {
        await msg.say(`What rule would you like to add?`);
        const response = (await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 10000})).first();
        if (!response) return "";
        return response;
    }
};