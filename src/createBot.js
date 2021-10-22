import { readFile } from 'fs/promises';
import { createBot } from 'mineflayer';
import { resolve } from 'path';
const file = './src/config/options.json';
const options = JSON.parse(await readFile(resolve(file)));

class Bot {
    constructor(host,user,pass,vers,auth,port) {
        this.host = host;
        this.user = user;
        this.pass = pass;
        this.vers = vers;
        this.auth = auth;
        this.port = port;
    }
    run() {
        return createBot({
            host: this.host,
            username: this.user,
            password: this.pass,
            version: this.vers,
            auth: this.auth,
            port: this.port
        })
    };
};

export { Bot, options };

