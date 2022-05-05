import { Bot, options } from "./createBot.js";
import { createInterface } from "readline";
import { writeFile } from 'fs/promises';
import { Client, Intents } from 'discord.js';
import chalk from 'chalk';
import handleEvents from "./functions/handleEvents.js";
import handleLiveChat from "./functions/handleLiveChat.js";
import readCommands from "./functions/loadCommands.js";
import loadPatterns from "./util/patterns.js";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


const tokenError = "There was a problem with your Discord bot token. Please try again.";
const exitMessage = chalk.yellow("Exisiting peacfully. To start again Type:", chalk.blue("npm start"));
const repolink = "https://github.com/febzey/mineflayerBot"


console.log(chalk.green('-------------------------------------------------------------'));
console.log(chalk.red(`
                        
    Hello! Thank you for using this bot! Have Fun and Enjoy! \n

    Message 'Febzey#1854' on discord for any questions. \n

    Check back frequently at ${repolink} for new features. \n

    Refer to /instructions/setup.md for detailed instructions.

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
    channelID,
    useDiscord;

async function startBot(a, b, c, d, e, f) {
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

    if (!askToLoginMineflayer)
        return console.warn(exitMessage), process.exit(1);


    if (!e) e = options.auth ? options.auth : 'microsoft';
    console.log(chalk.blue("Starting Minecraft Bot..."));
    const botInstance = new Bot(a, b, c, d, e, f);
    return bot = botInstance.run();

};


async function saveSettings() {

    const creds = token ? token : false;
    const liveChatChannel = channelID ? channelID : false;

    const settings = {
        host: host,
        email: email,
        pass: pass,
        version: version,
        auth: 'microsoft',
        port: port,
        token: creds,
        channelID: liveChatChannel,
        saveSettings: true
    };

    try {

        const promise = writeFile('./src/config/options.json', JSON.stringify(settings));
        await promise;

    } catch (err) {

        throw new Error("There was a problem saving your settings.");

    };

};


let LoginDiscord;

async function startDiscordBot(credentials) {

    LoginDiscord = (await promisedQuestion("Login Discord bot? Y or N: ")).toLowerCase() === 'y';

    if (LoginDiscord && credentials) {

        try { client.login(credentials); }
        catch { throw new Error(tokenError); };

        return await new Promise((resolve) => {

            client.on("ready", async () => {

                return resolve(console.log(chalk.green("Discord bot ready!")));

            });

        });

    };

    return;

};


let channelName;

async function setupDiscordBot() {

    token = await promisedQuestion("Discord bot Token: ");

    if (token) await startDiscordBot(token);

    channelID = await promisedQuestion("Channel ID for Live Chat. (leave blank to skip this): ");

    if (client.channels.cache.get(channelID) === undefined) return console.log(chalk.red("Invalid channel id."));

    channelName = client.channels.cache.get(channelID).name;

    console.log(chalk.blue(`Found channel: '${channelName}' successfully!`));

    return token;
};


async function initialize() {

    host = await promisedQuestion("Minecraft Server IP: ");
    version = await promisedQuestion("Server Version: ");
    port = await promisedQuestion("Port: ");
    email = await promisedQuestion("Minecraft Account Email: ");
    pass = await promisedQuestion("Minecraft Account Password: ");

    useDiscord = (await promisedQuestion("Setup a discord bot? Y or N: ")).toLowerCase() === 'y';

    if (useDiscord) await setupDiscordBot();

    if (host && version && port && email && pass) {

        const bool = token ? true : false;
        const channel = channelName ? channelName : false;

        console.table([
            {
                host: host,
                version: version,
                port: port,
                email: email,
                password: pass,
                useDiscordBot: bool,
                Live_Chat_Channel: channel
            }
        ]);

        const isCorrect = (await promisedQuestion("Does this look correct to you? Y or N: ")).toLowerCase() === 'y';

        if (!isCorrect) return initialize();

        const ask = (await promisedQuestion("Save these settings to a local file for later use? Y or N: ")).toLowerCase() === 'y';

        if (ask) await saveSettings();

        return startBot(host, email, pass, version, auth, port);

    }

    else {

        console.error(chalk.red("Error, you have left some things blank, Please restart.")),
        process.exit(1)

    };

};


async function start() {

    if (!options || !options.saveSettings) return initialize();

    const confirmUse = (await promisedQuestion("Do you want to use your locally stored settings? Y or N: ")).toLowerCase() === 'y';
    if (!confirmUse) return initialize();

    host = options.host;
    email = options.email;
    pass = options.pass;
    version = options.version;
    auth = options.auth;
    port = options.port;
    token = options.token;
    channelID = options.channelID;

    if (token) await startDiscordBot(token);

    await startBot(host, email, pass, version, auth, port);

};

//TODO: create live chat module.

start()

    .then(() => {

        if (!bot) return new Error("Error with code.");

        handleEvents(bot, host),
        loadPatterns(bot),
        readCommands('commands', bot);

        if (client && channelID && token && LoginDiscord) {
            handleLiveChat(client, bot, channelID, host);
        };


    })

    .then(() => {

        rl.on('line', (input) => {
            return bot.chat(input);
        });

    });


