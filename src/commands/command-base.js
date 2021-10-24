import chalk from "chalk";
export default function commandBase(bot, modules) {


    let {
        commands,
        minArgs = 0,
        maxArgs = null,
        expectedArgs = '',
        callback
    } = modules.default;


    if (typeof commands === 'string') commands = [commands];

    console.log(chalk.red("|"),'Loading command: ', chalk.green(`${commands[0]}`));

    const cooldown = new Set();

    const prefix = '!';

    bot.on("chat:chat", async (content) => {

        const username = content[0][0];
        const message = content[0][1];

        for (const alias of commands) {

            if (message.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {

                if (cooldown.has(bot.username)) return bot.whisper(username, "[Anti-Spam] Please wait 3 seconds.");

                cooldown.add(bot.username);
                setTimeout(() => { cooldown.delete(bot.username) }, 3000);

                const args = message.split(/[ ]+/);
                args.shift();

                if (args.length < minArgs || (maxArgs !== null && args.length > maxArgs)) {
                    return bot.whisper(username, `Bad usage. Please use ${prefix}${alias} ${expectedArgs}`);
                }

                /**
                 * callback Example
                 * @param username = 'Febzey'
                 * @param username = 'This is a message'
                 * @param username = '['This', 'is', 'a', 'message']'
                 * @Object bot = {bot}
                 */

                 return callback(username, message, args, bot);
                 

            };

        };

    });

};