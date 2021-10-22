export default {
    commands: ['test', 'poop'],
    minArgs: 0,
    maxArgs: 1,
    callback: async (username, message, args, bot) => {

        return await bot.chat("Hello Test Passed.")

    }
}