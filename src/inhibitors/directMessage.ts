import { Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'

class DirectMessageInhibitor extends Inhibitor {
    constructor() {
        super('directMessage', {
            reason: 'direct message'
        })
    }

    exec(message: Message): boolean {
        return !message.guild
    }
}

export default DirectMessageInhibitor
