import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

class StatusCommand extends Command {
    constructor() {
        super('status', {
            aliases: ['status'],
        })
    }

    exec(message: Message): Promise<Message> {
        return message.reply('Status!')
    }
}

export default StatusCommand
