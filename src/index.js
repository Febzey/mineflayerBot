import { Bot, options } from "./createBot.js";
import { createInterface } from "readline";
import { writeFile } from 'fs/promises';
import chalk from 'chalk';
import handleEvents from "./functions/handleEvents.js";
import readCommands from "./functions/loadCommands.js";
import loadPatterns from "./patterns.js";


    const repolink = "https://github.com/febzey/"


    console.log(chalk.green('-------------------------------------------------------------'))
    console.log(chalk.red(`
                        
    Hello! Thank you for using this bot! Have Fun and Enjoy! \n

    Message 'Febzey#1854' on discord for any questions. \n

    Check back frequently at ${repolink} for new features.

                        `))
    console.log(chalk.green('-------------------------------------------------------------'))




const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const promisedQuestion = (text) => {
    return new Promise((resolve) => rl.question(text, resolve));
}

const exitMessage = chalk.yellow("Exisiting peacfully. To start again Type:", chalk.blue("npm start"));

let bot;

let host,
    email,
    pass,
    version,
    auth,
    port;

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
    if(!e) e = options.auth;
    console.log(chalk.blue("Starting..."));
    const botInstance = new Bot(a, b, c, d, e, f);
    return bot = botInstance.run();
};

const askToStart = async () => {
    const askToStartBot = (await promisedQuestion(`Log Minecraft bot into ${host}? Y or N: `)).toLowerCase() === 'y';

    if (askToStartBot) {

        return startBot(host, email, pass, version, auth, port);

    }

    else {
        console.log(exitMessage);
        process.exit(1);
    }
}

const askToSave = async () => {
    const shouldSave = (await promisedQuestion("Would you like to save these settings for later use? Y or N ")).toLowerCase() === 'y';

    if (shouldSave) {

        const settings = {
            host: host,
            email: email,
            pass: pass,
            version: version,
            auth: 'microsoft',
            port: port,
            saveSettings: true
        };

        await writeFile('./src/config/options.json', JSON.stringify(settings)).catch(err => { throw new Error(err) });

        console.log(chalk.green("Saved Successfully. to `./src/config/options.json`"));

        return await askToStart();

    } else if (!shouldSave) {

        await writeFile('./src/config/options.json', JSON.stringify({saveSettings:false})).catch(err => { throw new Error(err) });

        console.warn(chalk.red("Settings will not be saved... and current ones will be deleted."));
        return await askToStart();

    }


}

const beginLogin = async () => {

    host = await promisedQuestion("Minecraft Server IP: ");
    version = await promisedQuestion("Server Version: ");
    port = await promisedQuestion("Port: ");
    email = await promisedQuestion("Minecraft Account Email: ");
    pass = await promisedQuestion("Minecraft Account Password: ");

    console.table([
        { host: host, version: version, port: port, email: email, password: pass }
    ]);

    const isCorrect = (await promisedQuestion("Is this information correct? Y or N ")).toLowerCase() === 'y';

    if (isCorrect) {

        return await askToSave();

    } else if (!isCorrect) return askQuestions();
}


const askQuestions = async () => {

    if (options.saveSettings) {

        let useLocalStorage = (await promisedQuestion("Do you want to use your locally saved settings? Y or N: ")).toLowerCase() === 'y';

        if (useLocalStorage) {

            try {

                host = options.host
                email = options.email;
                pass = options.pass;
                version = options.version;
                auth = options.auth;
                port = options.port;

            } catch (err) {

                throw new Error("It appears your locally stored settings are missing or inaccurate.");

            }

            return await askToStart();

        }

        else if (!useLocalStorage) {

            return await beginLogin();

        } 

    } else if (!options.saveSettings) {

        return await beginLogin();

    }


}

await askQuestions().then(() => {

    if (!bot) return new Error("Bot is undefined!");

    return handleEvents(bot, host),
           loadPatterns(bot),
           readCommands('commands', bot);

})
.then(() => {

    rl.on('line', (input) => {
       return bot.chat(input);
      });

})

