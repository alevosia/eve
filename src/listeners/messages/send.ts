import { Listener } from 'discord-akairo'
import { Message } from 'discord.js'

class MessageSendListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
            category: 'messages'
        })
    }

    exec(message: Message): void {
        if (message.author.bot) return

        this.client.logger.log('info', `${message.author.username}: ${message.content}`)
    }
}

export default MessageSendListener
