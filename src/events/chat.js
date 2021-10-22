import chalk from "chalk";

export default {
    name: "chat:chat",
    once: false,
    execute(content, bot) {
        
        const username = content[0][0];
        const message = content[0][1];

        
        return console.log(chalk.grey(`${username} » ${message}`));

    }
}