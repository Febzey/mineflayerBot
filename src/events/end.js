import chalk from "chalk";
export default {
    name: "end",
    once: false,
    execute(undefined, bot, host) {

        console.log(chalk.yellow("Mineflayer bot has disconnected from " + host));

        console.warn(chalk.yellow("Exiting Peacefully."));

        //create an auto restart here

        process.exit(1);
        
    }
}