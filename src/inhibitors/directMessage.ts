import { Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'

class DirectMessageInhibitor extends Inhibitor {
    constructor() {
        super('directMessage', {
            reason: 'direct message'
        })
    }

    exec(message: Message): boolean {
        return message.channel.type === 'dm'
    }
}

export default DirectMessageInhibitor
