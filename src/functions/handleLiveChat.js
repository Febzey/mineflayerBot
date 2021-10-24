import chalk from "chalk";
export default async function handleLiveChat(client, bot, channelID, host) {

    console.log(chalk.blue("Live Chat Initialized!"));

    try {
        client.channels.cache.get(channelID).send({
            embeds: [{
                color: '#238823',
                description: `✅ **Live Chat Initialized For: ${host} ** ✅ `
            }]
        });
    } catch { return };


    const embed = (id, text) => {
        try {
            return client.channels.cache.get(id).send({
                embeds: [{
                    description: text
                }]
            })
        }
        catch { return };
    };

    bot.on("message", (json) => {

        embed(channelID, json.toString());

    });

    client.on("messageCreate", (message) => {

        const { channel, content, author, member } = message;

        if (channel.id !== channelID) return;

        if (author.id === client.user.id) return;


        if (content.includes('\n')) return;

        try {

            bot.chat(`${content}`);

        } catch { return };

    });

    return;

};