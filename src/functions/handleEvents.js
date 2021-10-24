import { readdir } from 'fs/promises';
export default async function handleEvents(bot,host) {
    const eventFolder = await readdir('./src/events');
    const eventFiles = eventFolder.filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = await import(`../events/${file}`);
        event.default.once
        ? bot.once(event.default.name, (args) => 
            event.default.execute(args,bot,host)
        )
        : bot.on(event.default.name, (args) => 
            event.default.execute(args,bot,host)
        );
    };
};