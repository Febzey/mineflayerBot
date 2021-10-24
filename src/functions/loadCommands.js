import { readdir } from "fs/promises";
import commandBase from "../commands/command-base.js";

export default async function readCommands(dir, bot) {

    const baseFile = 'command-base.js';

    const files = await readdir(`./src/${dir}`);
        
    for (const file of files) {

        if (file !== baseFile) {

            let newPath = `../${dir}/${file}`;
            const modules = await import(newPath);

            commandBase(bot, modules);
        }
        
    }

}