import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            channel: 'guild',
        })
    }

    exec(message: Message): Promise<Message> {
        return message.reply('Pong!')
    }
}

export default PingCommand
