import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const followGoal = goals.GoalFollow;
export default {
    commands: ['follow', 'come'],
    minArgs:0,
    maxArgs:0,
    callback: async(username, message, args, bot) => {
        const mcData = require('minecraft-data')(bot.version);
        await bot.loadPlugin(pathfinder);
        if (username === bot.username) return;
        const movements = new Movements(bot, mcData);
        const target = bot.players[username] ? bot.players[username].entity : null;
        if (!target) return bot.chat("I do not see you!");
        bot.pathfinder.setMovements(movements);
        bot.pathfinder.setGoal(new followGoal(target, 2), true);
        movements.canDig = false;
        movements.allowSprinting = false;
        bot.on('death', () => bot.pathfinder.setGoal(null));
        bot.on("chat:chat", content => {
            const message = content[0][1];
            if (message.includes('stop' || 'stopfollow' || 'goaway')) {
                return bot.pathfinder.setGoal(null);
            };
        });
    }
};