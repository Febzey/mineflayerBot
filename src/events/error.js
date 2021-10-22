import chalk from "chalk";
export default {
    name: "error",
    once: false,
    execute(reason) {

        console.log(reason);

        console.log(chalk.red("-----------------------------------------------"))
        console.log(chalk.yellow("Fatal Error.\n Ensure your login credentials are correct. \n view `src/config/options.json` \n or restart with 'npm start'"))
        console.log(chalk.red("-----------------------------------------------"))
    }
};