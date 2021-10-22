export default function loadPatterns(bot) {

    bot.addChatPattern("whisperFrom", /^([^ ]*) whispers to you: (.*)$/, {
        parse: true,
    }); //ForestBot whispers to you: message

    //----------------------------------------------------------------

    bot.addChatPattern("whisperTo", /^\[me -> ([^ ]*)\] (.*)$/, {
        parse: true,
    }); //[me -> ForestBot] message

    bot.addChatPattern("whisperFrom", /^\[([^ ]*) -> me\] (.*)$/, {
        parse: true,
    }); //[ForestBot -> me] message

    //----------------------------------------------------------------

    bot.addChatPattern("whisperTo", /^You whisper to ([^ ]*): (.*)$/, {
        parse: true,
    }); //You whisper to ForestBot: message

    bot.addChatPattern("whisperFrom", /^([^ ]*) whispers: (.*)$/, {
        parse: true,
    }); //ForestBot whispers: message

    //----------------------------------------------------------------

    bot.addChatPattern("whisperTo", /^\[You -> ([^ ]*)\] (.*)$/, {
        parse: true,
    }); // [You -> Febzey] message

    bot.addChatPattern("whisperFrom", /^\[([^ ]*) -> You\] (.*)$/, {
        parse: true,
    }); // [Febzey -> You] message

    //----------------------------------------------------------------



    //----------------------------------------------------------------
    bot.addChatPattern("chat", /^<([^ ]*)> (.*)$/, {
        parse: true,
    }); // <febzey> message

    bot.addChatPattern("chat", /^([^ ]*): (.*)$/, {
        parse: true,
    }); // febzey: message

    bot.addChatPattern("chat", /^([^ ]*) » (.*)$/, {
        parse: true,
    }); // febzey » message

    bot.addChatPattern("chat", /^([^ ]*) > (.*)$/, {
        parse: true,
    }); // febzey > message'

    bot.addChatPattern("chat", /^\[Jr MOD\] ([^ ]*) ✪ > (.*)$/, {
        parse: true,
    }); // febzey > message
    //----------------------------------------------------------------


}