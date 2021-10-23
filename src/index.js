import { Bot, options } from "./createBot.js";
import { createInterface } from "readline";
import { writeFile } from 'fs/promises';
import { Client, Intents } from 'discord.js';
import chalk from 'chalk';
import handleEvents from "./functions/handleEvents.js";
import readCommands from "./functions/loadCommands.js";
import loadPatterns from "./patterns.js";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


const tokenError = "There was a problem with your Discord bot token. Please try again.";
const exitMessage = chalk.yellow("Exisiting peacfully. To start again Type:", chalk.blue("npm start"));
const repolink = "https://github.com/febzey/mineflayerBot"


console.log(chalk.green('-------------------------------------------------------------'));
console.log(chalk.red(`
                        
    Hello! Thank you for using this bot! Have Fun and Enjoy! \n

    Message 'Febzey#1854' on discord for any questions. \n

    Check back frequently at ${repolink} for new features.

                        `))
console.log(chalk.green('-------------------------------------------------------------'));


const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const promisedQuestion = (text) => {
    return new Promise((resolve) => rl.question(text, resolve));
};


let bot,
    host,
    email,
    pass,
    version,
    auth,
    port,
    token,
    useDiscord;

const startBot = async (a, b, c, d, e, f) => { //start minecraft and discord bot.

    /**
     * Description
     * @param {a} host
     * @param {b} email
     * @param {c} pass
     * @param {d} version
     * @param {e} auth
     * @param {f} port
     * @returns {bot}
     */

    const askToLoginMineflayer = (await promisedQuestion(`Log Minecraft bot into ${a}? Y or N: `)).toLowerCase() === 'y';

    if(!askToLoginMineflayer) return console.warn(exitMessage), process.exit(1);

    if (token) {

        const askToLoginDiscord = (await promisedQuestion("Login Discord bot? Y or N: ")).toLowerCase() === 'y';
        if (askToLoginDiscord && token) {
            try { client.login(token) }
            catch { throw new Error("There was an issue logging in the discord bot.")};
        }
 
    }

    if (!e) e = options.auth ? options.auth : 'microsoft';
    console.log(chalk.blue("Starting Minecraft Bot..."));
    const botInstance = new Bot(a, b, c, d, e, f);
    return bot = botInstance.run();

};


const saveSettings = async () => {

    const creds = token ? token : false;

    const settings = {
        host: host,
        email: email,
        pass: pass,
        version: version,
        auth: 'microsoft',
        port: port,
        token: creds,
        saveSettings: true
    };

    try {

        const promise = writeFile('./src/config/options.json', JSON.stringify(settings))
        await promise;

    } catch (err) {

        throw new Error("There was a problem saving your settings.")

    }

}


const setupDiscordBot = async () => {

    return token = await promisedQuestion("Discord bot Token: ");

};


const initialize = async () => {

    host = await promisedQuestion("Minecraft Server IP: ");
    version = await promisedQuestion("Server Version: ");
    port = await promisedQuestion("Port: ");
    email = await promisedQuestion("Minecraft Account Email: ");
    pass = await promisedQuestion("Minecraft Account Password: ");

    useDiscord = (await promisedQuestion("Setup a discord bot? Y or N: ")).toLowerCase() === 'y';

    if (useDiscord) await setupDiscordBot();

    if (host && version && port && email && pass) {

        const bool = token ? true : false;

        console.table([
            { host: host, version: version, port: port, email: email, password: pass, useDiscordBot: bool, }
        ]);

        const isCorrect = (await promisedQuestion("Does this look correct to you? Y or N: ")).toLowerCase() === 'y';

        if (!isCorrect) return initialize();

        const ask = (await promisedQuestion("Save these settings to a local file for later use? Y or N: ")).toLowerCase() === 'y';

        if (ask) await saveSettings();

        return startBot(host, email, pass, version, auth, port);

    }

    else {

        throw new Error("Error, Please try again.");

    }

};


const start = async () => {

    if (!options || !options.saveSettings) return initialize();

    const confirmUse = (await promisedQuestion("Do you want to use your locally stored settings? Y or N: ")).toLowerCase() === 'y';
    if (!confirmUse) return initialize();

    host = options.host
    email = options.email;
    pass = options.pass;
    version = options.version;
    auth = options.auth;
    port = options.port;
    token = options.token;

    return await startBot(host, email, pass, version, auth, port);

}



await start().then(() => {

    if (!bot) return new Error("Bot is undefined!");

    if (token || options.token) {

        client.on("ready", () => {
            console.log(chalk.green("Discord bot is online."))

        });
    }

    return handleEvents(bot, host),
           loadPatterns(bot),
           readCommands('commands', bot);

})
    .then(() => {

        rl.on('line', (input) => {
            return bot.chat(input);
        });

    })


