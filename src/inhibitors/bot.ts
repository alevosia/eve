import { Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'

class BotInhibitor extends Inhibitor {
    constructor() {
        super('bot', {
            reason: 'bot',
        })
    }

    exec(message: Message): boolean {
        return message.author.bot
    }
}

export default BotInhibitor
