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

    async exec(message: Message): Promise<void> {
        if (message.author.bot) {
            return
        }

        if (message.channel.type === 'dm') {
            this.client.logger.info(`[DM] - ${message.author.username}: ${message.content}`)
        } else {
            this.client.logger.info(
                `[${message.guild?.name}] #${message.channel.name} - ${message.author.username}: ${message.content}`
            )
        }
    }
}

export default MessageSendListener
