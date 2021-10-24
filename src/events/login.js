import chalk from "chalk";
export default {
    name: "login",
    once: true,
    execute(undefined, bot, host) {

        console.log(chalk.green(`Minecraft bot logged into ${host} successfully!`));


        // bot.chat("Hello world!");

        return;
    }
}