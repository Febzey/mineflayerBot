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
    token;

const startBot = (a, b, c, d, e, f) => {

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

    if(!e) e = options.auth ? options.auth : 'microsoft';
    console.log(chalk.blue("Starting Minecraft Bot..."));
    const botInstance = new Bot(a, b, c, d, e, f);
    return bot = botInstance.run();

};



const askToUseDiscordBot = async () => {

    const askToUse = (await promisedQuestion(`Setup Discord Bot? Y or N: `)).toLowerCase() === 'y';

    if (askToUse) {

        token = await promisedQuestion("Discord Bot Token: ");

        return;

    } else {

        return;

    };

};






const askToStart = async () => {

    const askToStartBot = (await promisedQuestion(`Log Minecraft bot into ${host}? Y or N: `)).toLowerCase() === 'y';

    if (askToStartBot) {

        return startBot(host, email, pass, version, auth, port);

    }

    else {
        console.log(exitMessage);
        process.exit(1);
    };
};







const askToSave = async () => {
    const shouldSave = (await promisedQuestion("Would you like to save these settings for later use? Y or N ")).toLowerCase() === 'y';

    if (shouldSave) {

        let creds = token && typeof token !== 'undefined' ? token : false;

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

        await writeFile('./src/config/options.json', JSON.stringify(settings)).catch(err => { throw new Error(err) });

        console.log(chalk.green("Saved Successfully. to `./src/config/options.json`"));

        return askToStart();

    } else if (!shouldSave) {

        await writeFile('./src/config/options.json', JSON.stringify({saveSettings:false})).catch(err => { throw new Error(err) });

        console.warn(chalk.red("Settings will not be saved... and current ones will be deleted."));
        return askToStart();

    }


};






const beginLogin = async () => {

    await askToUseDiscordBot();

    host = await promisedQuestion("Minecraft Server IP: ");
    version = await promisedQuestion("Server Version: ");
    port = await promisedQuestion("Port: ");
    email = await promisedQuestion("Minecraft Account Email: ");
    pass = await promisedQuestion("Minecraft Account Password: ");

    let bool = token ? true : false;

    console.table([
        { host: host, version: version, port: port, email: email, password: pass, useDiscordBot: bool, }
    ]);

    const isCorrect = (await promisedQuestion("Is this information correct? Y or N ")).toLowerCase() === 'y';

    if (isCorrect) {

        return askToSave();

    } else if (!isCorrect) return askQuestions();
}






const askQuestions = async () => {

    if (options.saveSettings) {

        let useLocalStorage = (await promisedQuestion("Do you want to use your locally saved settings? Y or N: ")).toLowerCase() === 'y';

        if (useLocalStorage) {

            let useDiscord;

            if (options.token && options.token !== false) { 

                useDiscord = (await promisedQuestion("Activate Discord bot? Y or N: ")).toLowerCase() === 'y';

            };

            try {

                host = options.host
                email = options.email;
                pass = options.pass;
                version = options.version;
                auth = options.auth;
                port = options.port;
                token = useDiscord ? options.token : false; 

                /**
                 * If useDiscord is true then set token to options.token, else set to false.
                 */

            } catch (err) {

                throw new Error("It appears your locally stored settings are missing or inaccurate.");

            }

            return askToStart();

        }

        else if (!useLocalStorage) {

            return beginLogin();

        } 

    } else if (!options.saveSettings) {

        return beginLogin();

    }


}





await askQuestions().then(() => {

    if (!bot) return new Error("Bot is undefined!");

    if (token) {

        try {
            client.login(token);
        } catch (err) {
            return console.error(chalk.red(tokenError))
        }


        client.on("ready", () => {
            console.log(chalk.green("Discord bot is online."))
            
        })
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


